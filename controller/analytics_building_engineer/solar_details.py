
from datetime import datetime
from typing import Any, Dict, Optional, Tuple, List

from calendar import month_abbr
from common import utils, point_utils, history_utils
from data.db_connection import DBConnection
from models.billing_cycle import BillingCycle
from models.unit import Unit
from typing import Any, Dict, List


def solar_generation_by_billing_cycle(
    building_id: int, year: int
) -> List[Dict[str, Any]]:
    # Get billing cycle start day of the month
    billing_cycle = BillingCycle.query.filter_by(building_id=building_id).first()
    if not billing_cycle:
        raise Exception(
            "Billing Cycle not configured for Solar for building, {}".format(
                building_id
            )
        )
    from_day = billing_cycle.from_day

    # Get solar meter point for the building
    Wh = Unit.query.filter_by(symbol="Wh").first()
    solar_energy_point_ids = [point["point_id"] for point in point_utils.get_asset_points(building_id, "Solar", unit_id=Wh.id)]

    total_by_month = []
    for month_idx in range(1, 13):
        # For the year, get the billing cycles
        start_time, end_time = utils.get_billing_cycle_limits_in_utc(from_day, month_idx, year)

        # For each billing cycle get total power generated
        # TODO: Replace timezone with timezone of the building
        history_data = history_utils.get_summed_point_history(
            solar_energy_point_ids, start_time, end_time, "America/New_York"
        )
        # Take the sum of the month and convert to KWh
        total_for_the_month = sum([rec["quantity"] for rec in history_data]) / 1000

        month_name = datetime.strptime(str(month_idx), "%m").strftime("%b")
        month_data = {
            "month_number": month_idx,
            "month_display": month_name[0],
            "quantity": total_for_the_month,
            "unit": "kWh",
        }
        total_by_month.append(month_data)

    return total_by_month


def get_annual_solar_generation(building_id: int, billing_cycle_from_day: int, year: int) -> List[Dict[str, Any]]:
    year_data = []
    for mn in range(1, 13):
        bc_start_time, bc_end_time = utils.get_billing_cycle_limits_in_utc(billing_cycle_from_day, mn, year)
        Wh = Unit.query.filter_by(symbol="Wh").first()
        solar_energy_point_ids = [point["point_id"] for point in point_utils.get_asset_points(building_id, "Solar", unit_id=Wh.id)]

        # TODO: Replace timezone with timezone of the building
        history_data = history_utils.get_summed_point_history(
            solar_energy_point_ids, bc_start_time, bc_end_time, "America/New_York"
        )
        total_solar = sum([sh["quantity"] for sh in history_data]) / 1000

        month_data = {
            "month_number": mn,
            "month_display": month_abbr[mn][0],
            "quantity": total_solar,
            "unit": "kWh",
        }
        year_data.append(month_data)
    return year_data