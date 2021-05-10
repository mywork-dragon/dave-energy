import pytz
from datetime import datetime, timedelta
from enum import Enum
from dateutil.relativedelta import relativedelta

import hszinc
from typing import Any, Dict, List, Optional, Tuple

from config import logger
from data.db_connection import DBConnection
from scheduled_jobs import lcl_utils
from common import slack, utils
from common import point_utils, history_utils
from scheduled_jobs.niagara4.events.niagara_status_type import NiagaraStatusType
from scheduled_jobs.niagara4.events import event_utils


class N4EventHandler:

    def __init__(self) -> None:
        pass


    # TODO: Handle writing failure to N4
    def dispatch_end_of_event(self, building_id: int) -> None:
        logger.info("Checking for stale events for building id: {}".format(building_id))

        # Check for dispatches which are in Pending state but are stale
        with DBConnection() as conn:
            sql = """select id from dispatch
                where building_id = %s
                and event_type = %s
                and status = 'PENDING'
                and end_date < %s"""
            for rec in conn.select_dict(sql, [building_id,
                                              NiagaraStatusType.DCM.value, datetime.utcnow().replace(tzinfo=pytz.utc)]):
                dispatch_id = rec["id"]
                logger.info("Found stale dispatch id: {}".format(dispatch_id))
                self._end_event(dispatch_id, building_id)


    def terminate_old_events(self) -> None:
        logger.info("Checking for stale events, which ending over 30 mins ago.")

        # Check for dispatches which are in Pending state but are stale
        with DBConnection() as conn:
            sql = """select dsp.id, dsp.end_date, dsp.building_id, bld.name
                from dispatch dsp
                    INNER JOIN building bld ON dsp.building_id = bld.id
                where dsp.event_type = %s
                and dsp.status = 'PENDING'
                and dsp.end_date < %s"""
            for rec in conn.select_dict(sql, [NiagaraStatusType.DCM.value,
                                              datetime.utcnow().replace(tzinfo=pytz.utc) - relativedelta(minutes=30)]):
                dispatch_id = rec["id"]
                logger.info("Found stale dispatch id, ending at, {}: {}".format(dispatch_id, rec['end_date']))

                self._end_event(dispatch_id, rec['building_id'])

                # utils.send_email(["amit@davidenergy.com"],
                #              "David Energy: End of DCM event for {}".format(rec["name"]),
                #              "DCM event has now ended, please check the Control Room on David Energy dashboard for more details.\n\n-David Energy Team")

    def _end_event(self, dispatch_id, building_id):
        for controllable_asset_id in event_utils.get_asset_ids_controllable(building_id):
            event_utils.write_event_to_n4(
                building_id,
                controllable_asset_id,
                False,
                NiagaraStatusType.NO_EVENT,
            )
            logger.info(
                "Wrote to N4 to end the dispatch: {}, for asset id: {}".format(
                    dispatch_id, controllable_asset_id
                )
            )

        with DBConnection() as conn:
            # Update status in db
            sql = "update dispatch set status = 'SUCCESS' where id = %s"
            conn.execute(sql, [dispatch_id])
            logger.info("Updated the status of the dispatch in db to SUCCESS: {}".format(dispatch_id))