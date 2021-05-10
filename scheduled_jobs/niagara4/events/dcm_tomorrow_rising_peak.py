
from datetime import datetime, timedelta
import pytz

from config import logger
from common import slack, utils
from data.db_connection import DBConnection
from scheduled_jobs import lcl_utils
from scheduled_jobs.niagara4.events.parent_event import ParentEvent


EST_TZ = pytz.timezone("America/New_York")

class DCMTomorrowRisingPeak(ParentEvent):

    def create_event(self, building_id: int):
        building = lcl_utils.get_building_details(building_id)
        # Read the current billing cycle peak
        current_peak_value = utils.get_billing_peak(building_id, datetime.now())
        if not current_peak_value:
            logger.warning("No billing peak set for building: {}".format(building_id))
            slack.send_alert("No billing peak set for building: {}".format(building_id))
            return

        # Read all forecast values for tomorrow, sorted earliest to latest
        _2_days_ago = datetime.now() + timedelta(days=2)
        tomorrow = datetime.now() + timedelta(days=1)
        tomorrow_forecast = []
        with DBConnection() as conn:
            sql = '''select df.id, df.power, df.utc_forecast
                from dnv_forecast df
                where df.building_id = %s
                and df.utc_forecast > NOW() and df.utc_forecast < %s
                and df.utc_computed in (select max(df1.utc_computed) 
                                        from dnv_forecast df1 
                                        where df1.building_id = df.building_id
                                        and df1.utc_forecast = df.utc_forecast)
                order by df.utc_forecast
                '''
            for rec in conn.select_dict(sql, [building_id, _2_days_ago]):
                if rec["utc_forecast"].astimezone(EST_TZ).date() == tomorrow.date():
                    tomorrow_forecast.append({
                        "ts_forecast": rec["utc_forecast"],
                        "power": rec["power"]
                    })

        # For every value check the previous three values
        # If there is a rising pattern create an event
        for idx in range(3, len(tomorrow_forecast)):
            if tomorrow_forecast[idx]["power"] > (ParentEvent.CLOSE_TO_PEAK_PCT * current_peak_value) and \
                tomorrow_forecast[idx]["power"] > (tomorrow_forecast[idx-3]["power"] + tomorrow_forecast[idx-3]["power"]*ParentEvent.RISING_PATTERN_PCT):
                logger.info("""Detected a rising tomorrow's forecast over a 4 interval, 4th highest forecast, {}
                            "compared to the 1st interval, {} "
                            "and compared to the billing peak, {}""".format(tomorrow_forecast[idx]["power"],
                                                                        tomorrow_forecast[idx-3]["power"],
                                                                        current_peak_value))
                # self._create_dcm_event(building_id, building["building_name"],
                #                     tomorrow_forecast[idx]["power"], current_peak_value,                                    
                #                     tomorrow_forecast[idx]["ts_forecast"],
                #                     "Seeing rising pattern in forecast for tomorrow in four consecutive values.")

                # utils.send_email("support@davidenergy.com",
                #                  ["amit@davidenergy.com", "sri@davidenergy.com", "ahmed@davidenergy.com", "james@davidenergy.com", "mushfiq@davidenergy.com"],
                #                 "DCM event for tomorrow for {}".format(building["building_name"]),
                #                 "\nStart Time: {}\n".format(tomorrow_forecast[idx]["ts_forecast"]) + \
                #                 "Cause: Seeing rising pattern in forecast for tomorrow in four consecutive values.\n" + \
                #                 "Please check the Control Room on David Energy dashboard for more details.\n\n-David Energy Team")