
from datetime import datetime, timedelta
import pytz
import traceback

from stat import S_ISDIR, S_ISREG

from config import logger
from common import slack
from data.db_connection import DBConnection
from scheduled_jobs.dnv.dnv_sftp import DNVSftp

REMOTE_FOLDER = "FORECASTS/"

FORECAST_INTERVL_IN_HRS = 1

class ReadForecasts(DNVSftp):

    CSV_COL_HEADERS = ["ForecastTime", "Power (kW)"]
    def __init__(self):
        self.name_to_building_id = {}
        with DBConnection() as conn:
            sql = "select id, name from building where id in ({})".format(",".join([str(id) for id in DNVSftp.BUILDING_IDS]))
            for rec in conn.select_dict(sql):
                self.name_to_building_id[rec["name"].lstrip("S.~3").lower()] = rec["id"]


    def run(self):
        self.read_files_to_dnv()


    def read_files_to_dnv(self):
        _now_minus_x = datetime.utcnow().replace(tzinfo=pytz.utc) - timedelta(hours=FORECAST_INTERVL_IN_HRS)
        with self.get_sftp_connection() as sftp:
            for entry in sftp.listdir_attr(REMOTE_FOLDER):
                mode = entry.st_mode
                if S_ISREG(mode):
                    # DNV_3110E59St_20210323_1900.csv
                    parts = entry.filename.rstrip(".csv").split("_")
                    building_name = parts[1].lower().lstrip("S.~3")
                    if not building_name in self.name_to_building_id:
                        logger.warning("Building name does not exist: {}".format(building_name))
                        slack.send_alert("DNV Forecast file issue: Building name does not exist, {}".format(building_name))
                        continue

                    building_id = self.name_to_building_id[building_name]
                    time_forecast_computed = datetime.strptime("{} {}".format(parts[2], parts[3]), "%Y%m%d %H%M")
                    utc_forecast_computed = time_forecast_computed.replace(tzinfo=pytz.utc)
                    if utc_forecast_computed < _now_minus_x:
                        continue

                    logger.info("Processing file name: {}".format(entry.filename))
                    remote_file = sftp.open("{}{}".format(REMOTE_FOLDER, entry.filename))
                    for line in remote_file:
                        line = line.strip()
                        if "ForecastTime" in line:
                            continue
                        
                        parts = line.split(",")
                        time_of_forecast = datetime.strptime(parts[0], "%Y-%m-%d %H:%M")
                        utc_forecast = time_of_forecast.replace(tzinfo=pytz.utc)
                        power = int(parts[1])
                        self.persist(building_id, utc_forecast_computed, utc_forecast, power)


    def persist(self, building_id, utc_computed, utc_forecast, power):
        with DBConnection() as conn:
            sql = """insert into dnv_forecast (building_id, utc_computed, utc_forecast, power)
                values (%s, %s, %s, %s)
                on conflict do nothing
                """
            conn.execute(sql, [building_id, utc_computed, utc_forecast, power])


def run():
    try:
        logger.info("Starting DNV meter feeder run.")
        rf = ReadForecasts()
        rf.run()
        logger.info("DNV meter feeder run completed")

    except:
        logger.error('Error while creating meter data files for DNV.')
        logger.error(traceback.format_exc())
        slack.send_alert('Error while creating meter data files for DNV.')
        slack.send_alert(traceback.format_exc())


if __name__ == "__main__":
    run()