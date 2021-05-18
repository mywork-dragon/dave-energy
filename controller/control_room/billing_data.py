
import pytz
from datetime import datetime

from common import utils, history_utils
from models.asset import Asset
from models.asset_type import AssetType
from models.point import Point


def get_billing_cycle_meter_values(building_id: int, from_time: datetime, to_time: datetime):
    meter_asset_type = AssetType.query.filter_by(name='Meter').first()
    meter_assets = Asset.query.filter_by(building_id=building_id,
                                         asset_type_id=meter_asset_type.id,
                                         energy_type='electric')

    meter_data = {}
    for asset in meter_assets:
        meter_point = Point.query.filter_by(asset_id=asset.id, tag='METER').first()
        energy_history = history_utils.get_point_history(meter_point.id, from_time, to_time)
        for eh in energy_history:
            ts = eh["ts"]
            ts = utils.round_up_to_current_fifteen_minutes(ts)

            quantity = round(eh["quantity"])
            if ts in meter_data:
                meter_data[ts] = meter_data[ts] + quantity
            else:
                meter_data[ts] = quantity
                
    meter_values = [
        dict(ts=key, quantity=value)
        for key, value in meter_data.items()
    ]
    
    return meter_values


    if __name__ == '__main__':
        from_time = datetime(2021, 2, 1, 5, 0, 0)
        now = pytz.utc.localize(datetime.utcnow())
        get_billing_cycle_meter_values(5, from_time, now)