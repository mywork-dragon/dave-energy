
import csv
from datetime import datetime, timedelta
import os
import pytz
from pathlib import Path
import traceback

from common import point_utils, history_utils
from config import logger
from common import slack
from scheduled_jobs.dnv.dnv_sftp import DNVSftp
from data.db_connection import DBConnection


DAVE_ENERGY_HOME_ENV_VAR = "DAVE_ENERGY_HOME"
FOLDER_NAME = "dnv_meter_data"
REMOTE_FOLDER = ""

class MeterFeeder(DNVSftp):

    CSV_COL_HEADERS = ["Timestamp", "Power(kW)"]
    
    def create_files(self):
        _now = datetime.now()
        time_of_run = _now.strftime("%Y%m%d-%H%M")

        utc_to = datetime.utcnow().replace(tzinfo=pytz.utc)
        utc_from = utc_to - timedelta(hours=1)

        meter_dir = self._empty_dir()

        # run at 50th min, create file with values for last 15th min intervals
        file_created = False
        with DBConnection() as conn:
            for building_id in DNVSftp.BUILDING_IDS:
                building_name = self._get_building_name(building_id)
                # Get all meter points
                meter_points = point_utils.get_asset_points(building_id, "Meter", tag="METER")
                meter_point_ids = [point["point_id"] for point in meter_points]

                # Sum 
                bc_demand_data = history_utils.get_summed_point_history(meter_point_ids, utc_from, utc_to)

                if bc_demand_data:
                    file_name = "{}_{}_{}.csv".format(building_name, building_id, time_of_run)
                    file_path = os.path.join(meter_dir, file_name)
                    with open(file_path, 'w') as csvfile:
                        csvwriter = csv.writer(csvfile)
                        csvwriter.writerow(MeterFeeder.CSV_COL_HEADERS)
                        for ts_and_quantity in bc_demand_data:
                            csvwriter.writerow([ts_and_quantity["ts"], round(ts_and_quantity["quantity"], 2)])
                        file_created = True

        return file_created


    def send_files_to_dnv(self):
        meter_dir_path = os.getenv(DAVE_ENERGY_HOME_ENV_VAR) + os.path.sep + FOLDER_NAME
        with self.get_sftp_connection() as sftp:
            for filename in os.listdir(meter_dir_path):
                file_path = meter_dir_path + os.path.sep + filename
                print(file_path)
                sftp.put(file_path, REMOTE_FOLDER)


    def _empty_dir(self):
        meter_dir_path = os.getenv(DAVE_ENERGY_HOME_ENV_VAR) + os.path.sep + FOLDER_NAME
        Path(meter_dir_path).mkdir(exist_ok=True)
        for filename in os.listdir(meter_dir_path):
            file_path = os.path.join(meter_dir_path, filename)
            os.unlink(file_path)
        
        return meter_dir_path

    
    def _get_building_name(self, building_id):
        with DBConnection() as conn:
            sql = "select name from building where id = %s"
            return conn.select_dict(sql, [building_id])[0]["name"]


    def run(self):
        file_created = self.create_files()
        if file_created:
            self.send_files_to_dnv()

    
def run():
    try:
        logger.info("Starting DNV meter feeder run.")
        mf = MeterFeeder()
        mf.run()
        logger.info("DNV meter feeder run completed")

    except:
        logger.error('Error while creating meter data files for DNV.')
        logger.error(traceback.format_exc())
        slack.send_alert('Error while creating meter data files for DNV.')
        slack.send_alert(traceback.format_exc())


if __name__ == "__main__":
    run()