from datetime import datetime
from datetime import timezone
from dateutil.relativedelta import relativedelta
import pytz

import hszinc

from config import logger
from common.constants import TZ_DATETIME_FORMAT
from data.db_connection import DBConnection
from common import slack
from scheduled_jobs import lcl_utils
from models.point import Point

EST_TZ = pytz.timezone("America/New_York")


def get_event_schedule_lst(building_id, start_time):
    event_lst = []
    with DBConnection() as conn:
        # Get the list of events starting after the start time
        sql = """select dsp.id as dispatch_id, dsp.schedule_date, dsp.end_date, dsp.status, dsp.event_type
            from dispatch dsp
            where dsp.building_id = %s
            and dsp.schedule_date > %s and dsp.schedule_date < %s
            order by dsp.id desc
            """
        for rec in conn.select_dict(
            sql, [building_id, start_time, datetime.utcnow().replace(tzinfo=timezone.utc)]):
            # Get the event attributes
            # TODO: The display timezone should be based on the location of the building
            event_start_time = rec["schedule_date"].replace(tzinfo=timezone.utc)
            event_end_time = rec["end_date"].replace(tzinfo=timezone.utc)
            _now_utc = datetime.utcnow().replace(tzinfo=pytz.utc)
            is_active = event_start_time <= _now_utc and _now_utc < event_end_time

            event = {
                "dispatch_id": rec["dispatch_id"],
                "start_date": event_start_time.astimezone(EST_TZ),
                "end_date": event_end_time.astimezone(EST_TZ),
                "event": rec["event_type"],
                "status": "ACTIVE" if is_active else rec["status"],
            }

            event["status"] = (
                "Completed" if event["status"] == "SUCCESS" else event["status"]
            )

            # For the point of the event, get assets which can be modified by the controller
            asset_id_and_names = _get_assets_modifiable_for_event(building_id)
            if asset_id_and_names:
                # TODO: Handle multiple assets which can be modified by the controller
                asset = asset_id_and_names[0]
                event["asset"] = asset["asset_name"]

                setting_points = []
                event_display_rows = _get_event_display_rows(
                    asset["asset_id"], rec["dispatch_id"], is_active
                )
                for row in event_display_rows:
                    row_dict = {
                        "default_set_point": {
                            "unit": row.unit_symbol,
                            "value": row.default_value,
                        },
                        "event_set_point": {
                            "unit": row.unit_symbol,
                            "value": row.event_value,
                        },
                        "point_id": row.point_id,
                        "point_name": row.point_name,
                        "revert_point_id": row.revert_point_id,
                        "revert_enabled": row.revert_enabled,
                    }
                    setting_points.append(row_dict)
                event["setting_points"] = setting_points

                # Set real time and target reduction
                event["real_time_reduction"] = {"unit": "kW", "value": 0}
                event["target_reduction"] = {"unit": "kW", "value": 0}

                event_lst.append(event)
            else:
                slack.send_alert(
                    "WARNING: Building, {building_id} has an active event but no asset modifiable by controller is configured."
                )
    # pprint.pprint(event_lst)
    return event_lst


def revert_controller_action(building_id, point_id, dispatch_id, user_id):
    point = Point.query.filter_by(id=point_id).first()
    n4_session = lcl_utils.get_n4_connection(building_id)

    logger.info("Writing {} to path {}".format(False, point.path))
    resp = n4_session.invoke_action(point.path, "set", val=False)
    logger.info(
        "Writing to N4 completed: {}, did write failed: {}".format(
            resp.is_done, resp.is_failed
        )
    )
    result = hszinc.dump(resp.result, hszinc.MODE_JSON)
    logger.info(result)

    # Persists to db
    with DBConnection() as conn:
        sql = '''insert into point_dispatch_revert
            (point_id, dispatch_id, user_id_reverted, utc_reverted)
            values (%s, %s, %s, %s)
            '''
        conn.execute(sql, [point_id, dispatch_id, user_id, datetime.utcnow().replace(tzinfo=timezone.utc)])


def _get_assets_modifiable_for_event(building_id):
    # For this building find assets which have all the points with tags meant for modifying values by the controller
    asset_id_and_names = []
    with DBConnection() as conn:
        sql = """select ast.id as asset_id, ast.name as asset_name
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
            where ast.building_id = %s
            and at.is_controller_accessible = true
            """
        for rec in conn.select_dict(sql, [building_id]):
            asset = {"asset_id": rec["asset_id"], "asset_name": rec["asset_name"]}
            asset_id_and_names.append(asset)

    return asset_id_and_names


def _get_event_display_rows(asset_id, dispatch_id, is_active):
    name_to_row = {}
    with DBConnection() as conn:
        sql = """select pt.id, pt.name, pt.path, pt.tag, ut.symbol as unit_symbol, pdr.id as pdr_id
            from point pt
                INNER JOIN unit ut ON pt.unit_id = ut.id
                LEFT JOIN point_dispatch_revert pdr ON pt.id = pdr.point_id and pdr.dispatch_id = %s
            where pt.asset_id = %s
            and pt.tag in ('DEFAULT_SETPOINT', 'EVENT_SETPOINT', 'OVERRIDE_SETPOINT')
            order by pt.name
            """
        for rec in conn.select_dict(sql, [dispatch_id, asset_id]):
            point_id = rec["id"]
            point_name = rec["name"]
            if not point_name in name_to_row:
                name_to_row[point_name] = EventDisplayRow(
                    point_id, rec["name"], rec["unit_symbol"]
                )

            event_display_row = name_to_row[point_name]
            if rec["tag"] == "DEFAULT_SETPOINT":
                event_display_row.default_value = str(
                    round(_get_latest_point_value(conn, point_id), 2)
                )
            elif rec["tag"] == "EVENT_SETPOINT":
                event_display_row.event_value = (
                    str(round(_get_latest_point_value(conn, point_id), 2))
                    if is_active
                    else "-"
                )
            elif rec["tag"] == "OVERRIDE_SETPOINT":
                event_display_row.revert_point_id = point_id
                # If pdr is set, point has been reverted before
                event_display_row.revert_enabled = False if rec["pdr_id"] else True

    ordered_rows = sorted(name_to_row.values(), key=lambda row: row.point_name)
    return ordered_rows


def _get_latest_point_value(conn, point_id):
    sql = "select quantity from history where point_id = %s order by id desc limit 1"
    return conn.select_dict(sql, [point_id])[0]["quantity"]


class EventDisplayRow:
    def __init__(self, point_id, point_name, unit_symbol):
        self.point_id = point_id
        self.point_name = point_name
        self.unit_symbol = unit_symbol
        self.default_value = None
        self.event_value = None
        self.revert_point_id = None
        self.revert_enabled = True


# if __name__ == "__main__":
#     revert_controller_action(5, 479)
