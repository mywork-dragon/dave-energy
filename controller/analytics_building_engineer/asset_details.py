import collections
import pytz
from datetime import datetime, timedelta, timezone
from dateutil.relativedelta import relativedelta
from typing import Any, Dict, List

from config import logger
from common import utils
from data.db_connection import DBConnection
from models.point import Point
from scheduled_jobs.niagara4.n4_reader import N4Reader
from scheduled_jobs.niagara4.n4_events_handler import N4EventHandler
from scheduled_jobs.niagara4.events import events_config


EST_TZ = pytz.timezone("America/New_York")
UTC = pytz.timezone("UTC")

ENERGY_CONSUMPTION_BOX = "energy_consumption"
ENERGY_DEMAND_BOX = "energy_demand"
SOLAR_BOX = "solar"
EXPORT_BOX = "export"


def asset_dropdowns(building_id: int) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    asset_to_devices: Dict[str, Any] = {}
    with DBConnection() as conn:
        sql = "select id, name from asset where building_id = %s"
        for rec in conn.select_dict(sql, [building_id]):
            asset_id = rec["id"]
            asset_name = rec["name"]
            key_asset = "{}_{}".format(asset_id, asset_name)

            sql = "select id, name from device where asset_id = %s"
            recs = conn.select_dict(sql, [asset_id])
            if recs:
                asset_to_devices[key_asset] = {}
                for rec1 in recs:
                    device_id = rec1["id"]
                    device_name = rec1["name"]
                    key_device = "{}_{}".format(device_id, device_name)
                    asset_to_devices[key_asset][key_device] = []

                    sql = """select id, name
                        from point
                        where device_id = %s
                        and not path ilike '%%override%%'
                        """
                    for rec2 in conn.select_dict(sql, [device_id]):
                        point = {"point_id": rec2["id"], "point_name": rec2["name"]}
                        asset_to_devices[key_asset][key_device].append(point)

    return asset_to_devices


def chart_values(
    building_id: int, point_id: int, start_time: datetime, end_time: datetime
) -> List[Dict[str, Any]]:

    point = Point.query.filter_by(id=point_id).first()
    read_n4_value_for_point(building_id, point)

    # TODO: Use building_id to determine time zone
    start_time = start_time.astimezone(UTC)
    end_time = end_time.astimezone(UTC)
    hr_to_quantity: Dict[str, Dict[str, Any]] = collections.OrderedDict()
    # Set 0-23hrs quantity to 0, this padding for the UI
    for hr in range(0, 24):
        key = "{:02d}:00".format(hr)
        hr_to_quantity[key] = {"ts": key, "quantity": 0}

    with DBConnection() as conn:
        # Timestamp and quantity
        sql = """select ts, quantity
            from history
            where point_id = %s
            and ts >= %s and ts < %s
            order by id
            """
        prev_hr = None
        for rec in conn.select_dict(sql, [point_id, start_time, end_time]):
            ts = rec["ts"].replace(tzinfo=timezone.utc)
            ts = ts.astimezone(EST_TZ)
            ts = utils.round_up_to_current_fifteen_minutes(ts)
            if prev_hr != None:
                if prev_hr != ts.hour:
                    # Display first value of the hr
                    prev_hr = ts.strftime("%H")
                else:
                    continue
            else:
                prev_hr = ts.strftime("%H")

            key = "{}:00".format(ts.strftime("%H"))
            hr_to_quantity[key]["quantity"] = rec["quantity"]

    unit_symbol = None
    unit_measure_of = None
    if point.unit:
        unit_symbol = point.unit.symbol
        unit_measure_of = point.unit.measure_of

    return {
        'chart_values': list(hr_to_quantity.values()),
        'unit_symbol': unit_symbol,
        'unit_measure_of': unit_measure_of
    }


def read_n4_value_for_point(building_id: int, point: Point) -> None:
    max_ts_read = utils.last_read_ts_in_db(point.id)
    # Check if timestamp is within the window, so we don't have to read again
    _window_start = datetime.utcnow().replace(tzinfo=pytz.utc) - timedelta(
        minutes=events_config.LOOKBACK_THRESHOLD_IN_MINS
    )
    if max_ts_read and max_ts_read > _window_start:
        logger.info("Point, {}, was read within the window.".format(point.id))
        return

    n4_reader = N4Reader(building_id)
    n4_reader.copy_point_values(point.id, point.path, max_ts_read)


def get_asset_boxes_by_building(building_id: int):
    boxes = []
    with DBConnection() as conn:
        # Electric consumption/demand
        sql = '''select count(*) as cnt
            from asset ast
                inner join asset_type at on ast.asset_type_id = at.id
            where at.name = 'Meter'
            and ast.energy_type = 'electric'
            and ast.building_id = %s
            '''
        cnt = conn.select_dict(sql, [building_id])[0]["cnt"]
        if cnt > 0:
            boxes.append(ENERGY_CONSUMPTION_BOX)
            boxes.append(ENERGY_DEMAND_BOX)

        # Solar
        sql = '''select count(*) as cnt
            from asset ast
                inner join asset_type at on ast.asset_type_id = at.id
            where at.name = 'Solar'
            and ast.energy_type = 'electric'
            and ast.building_id = %s
            '''
        cnt = conn.select_dict(sql, [building_id])[0]["cnt"]
        if cnt > 0:
            boxes.append(SOLAR_BOX)

        # Export
        sql = '''select count(*) as cnt
            from asset ast
                inner join asset_type at on ast.asset_type_id = at.id
                inner join point pt on ast.id = pt.asset_id
            where at.name = 'Meter'
            and ast.energy_type = 'electric'
            and pt.tag = 'METER_EXPORT'
            and ast.building_id = %s
            '''
        cnt = conn.select_dict(sql, [building_id])[0]["cnt"]
        if cnt > 0:
            boxes.append(EXPORT_BOX)
        
    return boxes