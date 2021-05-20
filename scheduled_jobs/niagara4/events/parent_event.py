
from datetime import datetime, timedelta
import pytz

import hszinc
from typing import Any, Dict, List, Optional, Tuple

from config import logger
from common import point_utils, history_utils
from common import slack, utils
from data.db_connection import DBConnection
from scheduled_jobs.niagara4.events.niagara_status_type import NiagaraStatusType
from scheduled_jobs import lcl_utils
from scheduled_jobs.niagara4.events import events_config, event_utils


FROM_EMAIL = "support@davidenergy.com"
TO_EMAIL_LST = ["amit@davidenergy.com", "sri@davidenergy.com", "ahmed@davidenergy.com", "james@davidenergy.com"]
EST_TZ = pytz.timezone("America/New_York")

class ParentEvent:

    CLOSE_TO_PEAK_PCT = 0.9
    RISING_PATTERN_PCT = 0.9
    

    def _get_latest_n4_value(self, building_id: int) -> Optional[Dict[str, Any]]:
        _now = datetime.utcnow().replace(tzinfo=pytz.utc)
        lookback_window_start = _now - timedelta(minutes=events_config.LOOKBACK_THRESHOLD_IN_MINS + 5)

        meter_points = point_utils.get_asset_points(building_id, "Meter", tag="METER")
        meter_point_ids = [point["point_id"] for point in meter_points]

        bc_demand_data = history_utils.get_summed_point_history(meter_point_ids, lookback_window_start, _now)
        if bc_demand_data:
            return bc_demand_data[-1]["quantity"]

        return None
        

    def _create_dcm_event(self, building_id: int, building_name: str,
                          latest_n4_value_total:float, current_peak_value: float,
                          utc_event_start: datetime, event_cause: str):
        self._write_event_to_db(current_peak_value, building_id, utc_event_start)
        ts_event_start = utc_event_start.astimezone(EST_TZ)

        for controllable_asset_id in event_utils.get_asset_ids_controllable(building_id):
            logger.info("Writing the event to N4 for asset id: {}".format(controllable_asset_id))
            event_utils.write_event_to_n4(building_id, controllable_asset_id, True, NiagaraStatusType.DCM)
        
        slack.send_alert('Created DCM event for building: {}({})'.format(building_name, building_id))

        # utils.send_email(FROM_EMAIL,
        #                  TO_EMAIL_LST,
        #                  "David Energy: DCM event created for {}".format(building_name),
        #                  "\nStart Time: {}\n".format(ts_event_start) + \
        #                  "Cause: {}\n".format(event_cause) + \
        #                  "Please check the Control Room on David Energy dashboard for more details.\n\n-David Energy Team")
                         

    def _check_for_active_event(self, building_id: int, latest_billing_peak: float):
        # TODO: Better lookback window, this is needed for case when 11.28 billing peak as changed which will
        # cause event to be generated from 11.28 to 11.30
        # 11.31 new meter value is read, although 11.30 is the end date of the event it is still active
        # and needs to be picked for possible extension
        lookback_window = datetime.utcnow().replace(tzinfo=pytz.utc) - timedelta(minutes=10)
        with DBConnection() as conn:
            # Check if exists
            sql = """select id from dispatch
                where building_id = %s
                and event_type = %s
                and status = 'PENDING'
                and end_date > %s
                """
            recs = conn.select_dict(
                sql, [building_id, NiagaraStatusType.DCM.value, lookback_window]
            )
            if recs:
                dispatch_id = recs[0]["id"]
                logger.info("Existing active event found, dispatch id: {}, updating.".format(dispatch_id))
                # Update
                sql = "update dispatch set power_kw = %s, end_date = %s where id = %s"
                conn.execute(sql, [latest_billing_peak,
                                   self._get_next_15th_min_datetime(),
                                   dispatch_id,])
                return True
            
        return False


    def _write_event_to_db(self, latest_billing_peak: float, building_id: int, utc_event_start_time: datetime) -> None:
        if not self._check_for_active_event(building_id, latest_billing_peak):
            with DBConnection() as conn:
                logger.info("Inserting new dispatch.")
                sql = """insert into dispatch (created_at, schedule_date, power_kw,
                                                building_id, end_date,
                                                status, event_type)
                    values (NOW(), %s, %s, %s, %s, %s, %s)
                    """
                conn.execute(sql, [utc_event_start_time,
                                   latest_billing_peak,
                                   building_id,
                                   self._get_next_15th_min_datetime(),
                                   "PENDING",
                                   NiagaraStatusType.DCM.value])

    
    def _get_next_15th_min_datetime(self) -> datetime:
        # If current min is 12, returns now + 3mins. If current min is 18, returns now + 12mins
        _now = datetime.utcnow().replace(tzinfo=pytz.utc)
        mins_to_add = 15 - (_now.minute % 15)
        return (_now + timedelta(minutes=mins_to_add)).replace(second=0, microsecond=0)