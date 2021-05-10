# This script integrates with the EPA EnergyStar Portfolio Manager (PM) service
# The script serves two main functions:
#  1) Put Meter consumption data for a given building, into Portfolio Manager, data includes:
#     a) kWh Usage
#     b) kWh Exported (in the case of Solar Meter)
#     c) Max Demand for a given cycle (in the case of the Grid Meter)
#  2) Get EnergyStar ratings from Portfolio Manager, and update the Mycor Database to match
# The script is run daily. Building meter consumption data is put to PM on a monthly basis,
# DATA_QA_DELAY days following the end of a billing cycle. Energy Scores are updated as available

from datetime import datetime
from dateutil.relativedelta import *
import pytz
import requests
from requests.auth import HTTPBasicAuth
from sqlalchemy import desc, func
import traceback
from typing import Dict, List, Tuple
from xml.etree import ElementTree

from app import db, Asset, BillingCycle, Building, EnergyStar, History, Point, Unit
from aws.secrets_manager import SecretsManager, SecretName
from common import slack
import common.utils as utils
from common.history_utils import get_summed_point_history
from controller.analytics_building_engineer.demand_details import peak_demand_for_month
from config import logger


PORTFOLIO_MANAGER_GET_SCORE_URL = (
    "https://portfoliomanager.energystar.gov/ws/property/{}/metrics?year={}&month={}"
)
PORTFOLIO_MANAGER_GET_CONSUMPTION_URL = (
    "https://portfoliomanager.energystar.gov/ws/meter/{}/consumptionData?startDate={}"
)
PORTFOLIO_MANAGER_POST_CONSUMPTION_URL = (
    "https://portfoliomanager.energystar.gov/ws/meter/{}/consumptionData"
)

# Number of days of Data Quality Assurance (QA) buffer between the end of a billing cycle and score update
DATA_QA_DELAY_DAYS = 7

# Buildings to update
BUILDING_IDS = [5]


class EnergyStarUpdater:

    UNIT_SYMBOL_TO_DIVISOR = {"W": 4000, "Wh": 1000, "kW": 4, "kWh": 1}

    def __init__(self, building_id: int):
        self.building = Building.query.filter_by(id=building_id).first()
        if not self.building.portfolio_manager_propertyid:
            raise Exception(
                f"Building {building_id} lacks required 'portfolio_manager_propertyid' value"
            )

    def authenticate(self) -> None:
        pm_creds = SecretsManager().get_secret(SecretName.PortfolioManager)
        self.auth = HTTPBasicAuth(pm_creds["username"], pm_creds["password"])

    def get_oldest_history_date(self, point: Point) -> datetime:
        oldest_history = (
            History.query.filter_by(point_id=point.id).order_by(History.ts).first()
        )
        if oldest_history:
            return oldest_history.ts
        # This point doesn't have any data, return now
        return datetime.utcnow()

    def cycles_to_update(self, start_date: datetime) -> List[Tuple[datetime, datetime]]:
        """
        Given a date, returns list of tuples representing billing cycles
        First billing cycle includes start date
        Last billing cycle ends at least DATA_QA_DELAY_DAYS before utc_now()
        """
        billing_cycle = BillingCycle.query.filter_by(
            building_id=self.building.id
        ).first()
        if not billing_cycle:
            logger.warning(f"No billing cycle found for building {self.building.id}")
            return []
        cycle_start_date, cycle_end_date = utils.get_billing_cycle_limits_in_utc(
            billing_cycle.from_day,
            start_date.month,
            start_date.year,
        )
        # Billing cycle limits is the start of the last day, add one day to capture last day's data
        cycle_end_date += relativedelta(days=1)
        ret = []
        utc_now = pytz.utc.localize(datetime.utcnow())
        while cycle_end_date + relativedelta(days=DATA_QA_DELAY_DAYS) < utc_now:
            ret.append((cycle_start_date, cycle_end_date))
            cycle_start_date += relativedelta(months=1)
            cycle_end_date += relativedelta(months=1)
        return ret

    def portfolio_manager_meter_to_points(self) -> Dict[int, List[Point]]:
        mapping: Dict[int, List[Point]] = {}
        points = (
            Point.query.filter(Point.portfolio_manager_meterid.isnot(None))
            .filter(Point.tag.in_(["METER", "METER_EXPORT"]))
            .join(Unit)
            .filter(Unit.symbol.in_(EnergyStarUpdater.UNIT_SYMBOL_TO_DIVISOR.keys()))
            .join(Asset)
            .filter(Asset.building_id == self.building.id)
            .all()
        )
        for point in points:
            if point.portfolio_manager_meterid in mapping:
                mapping[point.portfolio_manager_meterid].append(point)
            else:
                mapping[point.portfolio_manager_meterid] = [point]
        return mapping

    def group_points_by_unit_and_tag(
        self, points: List[Point]
    ) -> Dict[Tuple[str, str], List[Point]]:
        # Given a list of points, returns Dict:
        # {
        #   ('tag', 'unit.symbol') : [point1, point2, ...]
        # }
        ret: Dict[Tuple[str, str], List[Point]] = {}
        for point in points:
            if (point.tag, point.unit.symbol) in ret:
                ret[(point.tag, point.unit.symbol)].append(point)
            else:
                ret[(point.tag, point.unit.symbol)] = [point]
        return ret

    def export_meter_data(self, meter_id: int, data: List[Dict[str, str]]) -> None:
        # Convert dict of data to export into XML compliant with Energy Star API
        # XML conversion done using https://docs.python.org/3/library/xml.etree.elementtree.html
        # https://portfoliomanager.energystar.gov/webservices/home/api/meter/consumptionData/post
        if len(data) <= 0:
            return
        url = PORTFOLIO_MANAGER_POST_CONSUMPTION_URL.format(meter_id)
        headers = {"Content-Type": "application/xml"}
        root = ElementTree.Element("meterData")
        for cycle_data in data:
            consumption_element = ElementTree.SubElement(root, "meterConsumption")
            consumption_element.set("estimatedValue", "false")
            for elem_name, elem_text in cycle_data.items():
                elem = ElementTree.SubElement(consumption_element, elem_name)
                if elem_name == "demandTracking":
                    demand_elem = ElementTree.SubElement(elem, "demand")
                    demand_elem.text = elem_text
                else:
                    elem.text = elem_text
        resp = requests.post(
            url=url,
            data=ElementTree.tostring(root, encoding="UTF-8", method="xml"),
            auth=self.auth,
            headers=headers,
        )
        if not resp.ok:
            logger.warning(
                f"Attempted to put data to portfolio manager for meter {meter_id}, but got status {resp.status_code} with response {resp.text}"
            )

    def update_portfolio_manager_data(self) -> None:
        logger.debug(
            f"Updating Portfolio Manager meter data for building {self.building.id}"
        )
        for pm_meter, points in self.portfolio_manager_meter_to_points().items():
            start_date = min([self.get_oldest_history_date(point) for point in points])
            # Find end of meter data in Portfolio Manager
            url = PORTFOLIO_MANAGER_GET_CONSUMPTION_URL.format(
                pm_meter, start_date.strftime("%Y-%m-%d")
            )
            response = requests.get(url, auth=self.auth)
            root = ElementTree.fromstring(response.text)
            latest_pm_data_end_date = max(
                [
                    datetime.strptime(elem.text, "%Y-%m-%d")
                    if elem.text
                    else start_date
                    for elem in root.findall("./meterConsumption/endDate")
                ]
            )
            data = []
            # For each complete cycle between then and now - QA_DELAY, update data
            for cycle_start_date, cycle_end_date in self.cycles_to_update(
                latest_pm_data_end_date + relativedelta(days=1)
            ):
                # Get history totals
                totals = {"METER": 0, "METER_EXPORT": 0}
                point_grouping = self.group_points_by_unit_and_tag(points)
                for (tag, unit_symbol), grouped_points in point_grouping.items():
                    ts_to_quantities = get_summed_point_history(
                        [point.id for point in grouped_points],
                        cycle_start_date,
                        cycle_end_date,
                    )
                    totals[tag] += (
                        sum([item["quantity"] for item in ts_to_quantities])
                        / EnergyStarUpdater.UNIT_SYMBOL_TO_DIVISOR[unit_symbol]
                    )
                # Put totals
                export = int(totals["METER_EXPORT"])
                cycle_data = {
                    # In the Solar case, Usage = Generation - Export
                    # In the Grid case, Export -> 0
                    "usage": str(int(totals["METER"] - export)),
                    "startDate": cycle_start_date.strftime("%Y-%m-%d"),
                    "endDate": cycle_end_date.strftime("%Y-%m-%d"),
                }
                if export > 0:
                    cycle_data["energyExportedOffSite"] = str(export)
                    cycle_data["RECOwnership"] = "Sold"
                else:
                    # If we didn't export anything, we're probably the main grid meter
                    cycle_data["demandTracking"] = str(
                        peak_demand_for_month(
                            building_id=self.building.id,
                            month_idx=cycle_start_date.month,
                            year=cycle_start_date.year,
                        )
                    )
                logger.debug(
                    f"Updating Portfolio Manager meter {pm_meter} with cycle ending on date {cycle_data['endDate']}: Putting 'usage' {cycle_data['usage']} and 'export' {export}."
                )
                data.append(cycle_data)
            self.export_meter_data(pm_meter, data)

    def read_energy_stars(self) -> None:
        # If this building has had an Energy Star score, read scores, starting from a month after the newest score date
        # If there's never been an Energy Star score, attempt to update from one month before now
        # See documentation for Energy Star API
        # https://portfoliomanager.energystar.gov/webservices/home/api/reporting/propertyMetrics/get
        start_date = datetime.utcnow() - relativedelta(months=1)
        newest_score = (
            EnergyStar.query.filter_by(building_id=self.building.id)
            .order_by(desc(EnergyStar.year))
            .order_by(desc(EnergyStar.month))
            .first()
        )
        if newest_score:
            start_date = datetime(
                day=1, month=newest_score.month, year=newest_score.year
            ) + relativedelta(months=1)
        for dt, _ in self.cycles_to_update(start_date):
            date_str = dt.strftime("%m/%Y")
            logger.debug(
                f"Updating EnergyStar score for building {self.building.id} and date {date_str}"
            )
            url = PORTFOLIO_MANAGER_GET_SCORE_URL.format(
                self.building.portfolio_manager_propertyid,
                dt.year,
                dt.month,
            )
            headers = {"Content-Type": "application/xml", "PM-Metrics": "score"}
            response = requests.get(url, auth=self.auth, headers=headers)
            root = ElementTree.fromstring(response.text)
            value_element = root.find(
                f".[@month='{dt.month}'][@year='{dt.year}']/metric[@name='score']/value"
            )

            if isinstance(value_element, ElementTree.Element) and value_element.text:
                score = int(value_element.text)
                logger.info(
                    f"Adding EnergyStar Score {score} for building {self.building.id} in month {date_str}"
                )
                energy_star = EnergyStar(
                    score=score,
                    building_id=self.building.id,
                    month=dt.month,
                    year=dt.year,
                )
                db.session.add(energy_star)
                db.session.commit()
            else:
                logger.info(
                    f"Portfolio Manager missing score for building {self.building.id} and month {date_str}"
                )


def run() -> None:
    logger.info(f"Starting EnergyStar update run.")
    for building_id in BUILDING_IDS:
        try:
            logger.info(f"Starting EnergyStar update for building {building_id}.")
            esu = EnergyStarUpdater(building_id=building_id)
            esu.authenticate()
            esu.update_portfolio_manager_data()
            esu.read_energy_stars()
            logger.info(f"EnergyStar update completed for building {building_id}.")

        except:
            logger.error(
                f"Error while updating EnergyStar scores for building {building_id}."
            )
            logger.error(traceback.format_exc())
            slack.send_alert(
                f"Error while updating EnergyStar scores for building {building_id}."
            )
            slack.send_alert(traceback.format_exc())
    logger.info(f"EnergyStar update run completed.")


if __name__ == "__main__":
    run()
