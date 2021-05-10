
import pytz

from datetime import datetime

from common import history_utils, point_utils, utils
from models.asset import Asset
from models.asset_type import AssetType
from models.building import Building


# Returns total solar generated in current billing cycle and today
def get_solar_totals(building: Building):
    # Get solar meter point
    solar_meter_points = point_utils.get_asset_points(building.id, "Solar", tag="METER")
    if len(solar_meter_points) == 0:
        return {}

    now_utc = pytz.utc.localize(datetime.utcnow())
    # Get Billing cycle start date
    meter_point_ids = [point["point_id"] for point in solar_meter_points]
    utc_bc_start_time = utils.get_current_billing_cycle_start_time_utc(building.billing_cycles[0].from_day)
    # Current Billing Cycle total
    ts_and_quantities = history_utils.get_summed_point_history(meter_point_ids, utc_bc_start_time, now_utc)
    bc_solar_total = sum([item["quantity"] for item in ts_and_quantities]) / 4

    # Today's total
    midnight_today = pytz.utc.localize(utils.get_zero_hour_time())
    ts_and_quantities = history_utils.get_summed_point_history(meter_point_ids, midnight_today, now_utc)
    total_solar_total = sum([item["quantity"] for item in ts_and_quantities]) / 4

    return {
            "billing_cycle_solar_total": int(round(bc_solar_total/1000)),
            "today_solar_total": int(round(total_solar_total/1000)),
            "unit": "kWh"
        }