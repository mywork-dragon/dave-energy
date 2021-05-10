
from datetime import datetime
import pytz

from common import utils, point_utils, history_utils


EST_TZ = pytz.timezone("America/New_York")

# TODO: Timezone should be of the building
# TODO: Handle assets other than HVAC
def compute_other_chart_values(building_id: int, from_time: datetime, to_time: datetime):
    # Add Electric meter
    meter_points = point_utils.get_asset_points(building_id, "Meter", tag="METER")
    meter_point_ids = [point["point_id"] for point in meter_points]
    meter_data_raw = history_utils.get_summed_point_history(meter_point_ids, from_time, to_time)
    meter_ts_to_quantity = {}
    for data in meter_data_raw:
        meter_ts_to_quantity[data["ts"].astimezone(EST_TZ).strftime("%H:%M")] = int(round(data["quantity"]))
    
    # Add Solar meter 
    solar_meter_points = point_utils.get_asset_points(building_id, "Solar", tag="METER")
    solar_meter_point_ids = [point["point_id"] for point in solar_meter_points]
    solar_data_raw = history_utils.get_summed_point_history(solar_meter_point_ids, from_time, to_time)
    solar_ts_to_quantity = {}
    for data in solar_data_raw:
        quantity = data["quantity"]
        if solar_meter_points[0]["unit_symbol"] == "W":
            quantity = quantity / 1000
        solar_ts_to_quantity[data["ts"].astimezone(EST_TZ).strftime("%H:%M")] = int(round(quantity))
    
    # Subtract HVAC meter
    hvac_meter_points = point_utils.get_asset_points(building_id, "HVAC", tag="METER")
    hvac_meter_point_ids = [point["point_id"] for point in hvac_meter_points]
    hvac_data_raw = history_utils.get_summed_point_history(hvac_meter_point_ids, from_time, to_time)
    hvac_ts_to_quantity = {}
    for data in hvac_data_raw:
        hvac_ts_to_quantity[data["ts"].astimezone(EST_TZ).strftime("%H:%M")] = (-1) * int(round(data["quantity"]))

    # Subtract Electric export
    meter_export_points = point_utils.get_asset_points(building_id, "Meter", tag="METER_EXPORT")
    meter_export_point_ids = [point["point_id"] for point in meter_export_points]
    meter_export_data = history_utils.get_summed_point_history(meter_export_point_ids, from_time, to_time)
    export_ts_to_quantity = {}
    for data in meter_export_data:
        export_ts_to_quantity[data["ts"].astimezone(EST_TZ).strftime("%H:%M")] = (-1) * int(round(data["quantity"]))
    
    other_data = []
    for hr in range(0, 24):
        for min in ['00', '15', '30', '45']:
            key = "{:02d}:{}".format(hr, min)
            quantity = 0.0
            if key in meter_ts_to_quantity:
                quantity = meter_ts_to_quantity[key]
            if key in solar_ts_to_quantity:
                quantity += solar_ts_to_quantity[key]
            if key in export_ts_to_quantity:
                quantity += export_ts_to_quantity[key]
            if key in hvac_ts_to_quantity:
                quantity += hvac_ts_to_quantity[key]

            other_data.append({
                "ts": key,
                "quantity": int(round(quantity))
            })
    
    return other_data