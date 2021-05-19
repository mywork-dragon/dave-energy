
import csv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import os

from scheduled_jobs.http_reads.nyiso.read_nyiso_lmp import download_data, get_lmp_instance, NYISOReportKEY


BASEDIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOAD_DIR = f'{BASEDIR}/nyiso/downloaded_files'

def run(is_real_time):
    start_date = datetime(2014, 1, 1).date()
    end_date = datetime.now().date()
    delta = relativedelta(months=1)
    download_dir = os.path.join(DOWNLOAD_DIR, "real_time" if is_real_time else "day_ahead")
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    curr_start_dt = start_date
    while curr_start_dt < end_date:
        curr_end_dt = curr_start_dt + delta - timedelta(days=1)
        if curr_end_dt > end_date:
            curr_end_dt = end_date
        year, month, _ = str(curr_start_dt).split('-')
        csv_filename = f"{download_dir}/{month}-{year}.csv"
        if not os.path.isfile(csv_filename):
            try:
                download_data(csv_filename, curr_start_dt.strftime("%m/%d/%Y"),
                                            curr_end_dt.strftime("%m/%d/%Y"),
                                        NYISOReportKEY.RealTime if is_real_time else NYISOReportKEY.DayAhead)
            except:
                print('Error while downloading file for {} to {}'.format(curr_start_dt, curr_end_dt))
                continue

        # zones_not_present = set()
        # if os.path.isfile(csv_filename):
        #     fp = open(csv_filename, "r")
        #     csv_reader = csv.DictReader(fp)
        #     for row in csv_reader:
        #         lmp = get_lmp_instance(row)
        #         if lmp:
        #             lmp.persist()
        #         else:
        #             zone_name = row["Zone Name"].lower()
        #             zones_not_present.add(zone_name)

        # if zones_not_present:
        #     print("Zones not present: {}".format(zones_not_present))

        curr_start_dt += delta


if __name__ == "__main__":
    # Real time
    run(True)
    # Day Ahead
    run(False)