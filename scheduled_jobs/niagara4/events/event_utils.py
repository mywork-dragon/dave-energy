
import hszinc

from typing import Any, Dict, List, Optional, Tuple

from config import logger
from data.db_connection import DBConnection
from scheduled_jobs import lcl_utils
from scheduled_jobs.niagara4.events.niagara_status_type import NiagaraStatusType
from scheduled_jobs.niagara4.events import events_config


def write_event_to_n4(
        building_id: int,
        asset_id: int,
        status_point_val: bool,
        status_type_val: NiagaraStatusType,) -> None:
        n4_session = lcl_utils.get_n4_connection(building_id)

        # Get points to write
        event_status_point_path = get_point_path(asset_id, events_config.POINT_EVENT_ENABLE_TAG)
        if event_status_point_path:
            logger.info(
                "Writing {} to path {}".format(
                    status_point_val, event_status_point_path
                )
            )
            resp = n4_session.invoke_action(
                event_status_point_path, "set", val=status_point_val
            )
            logger.info(
                "Writing to N4 completed: {}, did write failed: {}".format(
                    resp.is_done, resp.is_failed
                )
            )
            result = hszinc.dump(resp.result, hszinc.MODE_JSON)
            logger.info(result)

        event_status_type_path = get_point_path(asset_id, events_config.POINT_EVENT_TYPE_TAG)
        if event_status_type_path:
            logger.info(
                "Writing {} to path {}".format(status_type_val, event_status_type_path)
            )
            resp = n4_session.invoke_action(
                event_status_type_path, "set", val=status_type_val.value
            )
            logger.info(
                "Writing to N4 completed: {}, did write failed: {}".format(
                    resp.is_done, resp.is_failed
                )
            )
            result = hszinc.dump(resp.result, hszinc.MODE_JSON)
            logger.info(result)


def get_point_path(asset_id: int, event_tag: str) -> str:
    with DBConnection() as conn:
        sql = "select path from point where asset_id = %s and tag = %s"
        recs = conn.select_dict(sql, [asset_id, event_tag])
        return str(recs[0]["path"])


def get_asset_ids_controllable(building_id: int) -> List[int]:
    asset_ids = []
    with DBConnection() as conn:
        sql = """select distinct ast.id
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
            where ast.building_id = %s
            and at.is_controller_accessible = true
            """
        for rec in conn.select_dict(sql, [building_id]):
            asset_ids.append(int(rec["id"]))

    return asset_ids