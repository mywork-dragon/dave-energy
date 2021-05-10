
import pytz
from calendar import month_abbr
from datetime import datetime
from typing import Any, Dict, Optional, Tuple, List

from common import utils, point_utils, history_utils
from data.db_connection import DBConnection
from models.billing_cycle import BillingCycle
from models.building import Building
from models.point import Point
from third_party.utility_api.utility_api_wrapper import UtilityApiWrapper


class DemandDetails:

    def __init__(self):
        self.utility_api_wrapper = UtilityApiWrapper()
        self.year_to_month_to_values = {}


    def get_annual_energy_demand(self, building: Building, year: int) -> List[Dict[str, Any]]:
        year_data = []
        _now = datetime.now()
        for month_idx in range(1, 13):
            month_data = {
                "month_number": month_idx,
                "month_display": month_abbr[month_idx][0],
                "unit": "kW",
            }
            month_data["quantity"] = 0
            if month_idx > _now.month:
                # Future month
                year_data.append(month_data)
                continue

            peak_demand = self._peak_demand_for_month(building.id, year, month_idx)
            if peak_demand:
                month_data["quantity"] = peak_demand
            else:
                month_value = self._read_from_api(building, year, month_idx)
                if month_value:
                    month_data["quantity"] = month_value

            year_data.append(month_data)

        return year_data


    def _peak_demand_for_month(self, building_id: int, year: int, month_idx: int) -> Tuple[Dict[str, Any], Point]:
        billing_cycle = BillingCycle.query.filter_by(building_id=building_id).first()
        utc_bc_start_time, utc_bc_end_time = utils.get_billing_cycle_limits_in_utc(billing_cycle.from_day, month_idx, year)
        if utc_bc_start_time > datetime.utcnow().replace(tzinfo=pytz.utc):
            return None

        meter_points = point_utils.get_asset_points(building_id, "Meter", tag="METER")
        meter_point_ids = [point["point_id"] for point in meter_points]
        bc_demand_data = history_utils.get_summed_point_history(meter_point_ids, utc_bc_start_time, utc_bc_end_time)
        if not bc_demand_data:
            # This can happen when we are looking for beyond what we have in historical data
            return None

        month_peak = max([demand["quantity"] for demand in bc_demand_data])
        return int(round(month_peak))

    
    def _read_from_api(self, building: Building, year: int, month_idx: int):
        building_address = building.service_address if building.service_address else building.address
        if not year in self.year_to_month_to_values:
            self.year_to_month_to_values[year] = self.utility_api_wrapper.get_energy_consumption_by_cycle(year, building_address)
        
        return self.year_to_month_to_values[year][month_idx]