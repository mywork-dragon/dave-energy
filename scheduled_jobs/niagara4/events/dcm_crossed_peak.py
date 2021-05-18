
from datetime import datetime, timedelta
import pytz
from typing import Any, Dict, List, Optional, Tuple

from config import logger
from data.db_connection import DBConnection
from scheduled_jobs import lcl_utils
from common import slack, utils
from common import point_utils, history_utils
from scheduled_jobs.niagara4.events.niagara_status_type import NiagaraStatusType
from scheduled_jobs.niagara4.events.parent_event import ParentEvent
from scheduled_jobs.niagara4.events import events_config


class DCMCrossedPeak(ParentEvent):

    def _get_last_four_n4_value(self, building_id: int) -> Optional[Dict[str, Any]]:
        _now = datetime.utcnow().replace(tzinfo=pytz.utc)
        lookback_window_start = _now - timedelta(minutes=(events_config.LOOKBACK_THRESHOLD_IN_MINS*4) + 10)

        meter_points = point_utils.get_asset_points(building_id, "Meter", tag="METER")
        meter_point_ids = [point["point_id"] for point in meter_points]

        bc_demand_data = history_utils.get_summed_point_history(meter_point_ids, lookback_window_start, _now)
        if bc_demand_data and len(bc_demand_data) == 4:
            bc_demand_data.reverse()
            return [
                bc_demand_data[0]["quantity"],
                bc_demand_data[1]["quantity"],
                bc_demand_data[2]["quantity"],
                bc_demand_data[3]["quantity"]
            ]

        return None


    def create_event(self, building_id: int):
        building = lcl_utils.get_building_details(building_id)
        latest_four_n4_values = self._get_last_four_n4_value(building_id)
        if not latest_four_n4_values:
            logger.info("We don't have enough(atleast 4) N4 values, read for building: {}".format(building_id))
            return

        logger.info("We have N4 value read within the last {} mins for building: {}, it is: {}".format(
                events_config.LOOKBACK_THRESHOLD_IN_MINS,
                building_id,
                latest_four_n4_values[0],))
        # Read the current billing cycle peak
        current_peak_value = utils.get_billing_peak(building_id, datetime.now())
        if not current_peak_value:
            logger.warning("No billing peak set for building: {}".format(building_id))
            slack.send_alert("No billing peak set for building: {}".format(building_id))
            return

        logger.info("Current billing cycle peak value for building, {}, is, {}".format(building_id, current_peak_value))
        if latest_four_n4_values[0] > current_peak_value:
            logger.info("Latest N4, {} exceeds peak, {}. Writing the event to db.".format(latest_four_n4_values[0],
                                                                                          current_peak_value))
            self._create_dcm_event(building_id, building["building_name"],
                                   latest_four_n4_values[0], current_peak_value,
                                   datetime.utcnow().replace(tzinfo=pytz.utc),
                                   "Latest N4 read crossed current billing cycle peak.")
            return True

        if latest_four_n4_values[0] > (ParentEvent.CLOSE_TO_PEAK_PCT * current_peak_value) and \
            latest_four_n4_values[0] > (latest_four_n4_values[3] + latest_four_n4_values[3]*ParentEvent.RISING_PATTERN_PCT):
            logger.info("Detected a rising consumption, latest N4 read, {} compared to four reads ago, {} " + \
                        "and compared to the billing peak, {}".format(latest_four_n4_values[0],
                                                                      latest_four_n4_values[3],
                                                                      current_peak_value))
            self._create_dcm_event(building_id, building["building_name"],
                                   latest_four_n4_values[0], current_peak_value,
                                   datetime.utcnow().replace(tzinfo=pytz.utc),
                                   "Seeing rising pattern of consumption in last 4 N4 reads.")
            return True
    
        return False