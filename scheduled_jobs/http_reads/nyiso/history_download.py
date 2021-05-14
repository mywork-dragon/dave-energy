
import csv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import os

from scheduled_jobs.http_reads.nyiso.read_nyiso_lmp import download_data, get_lmp_instance, NYISOReportKEY


def run():
    start_date = datetime(2014, 1, 1).date()
    end_date = datetime.now().date()
    delta = relativedelta(months=1)
    curr_start_dt = start_date
    while curr_start_dt < end_date:
        curr_end_dt = curr_start_dt + delta - timedelta(days=1)
        if curr_end_dt > end_date:
            curr_end_dt = end_date
        year, month, _ = str(curr_start_dt).split('-')
        csv_filename = f"./nyiso/rt_{month}-{year}.csv"
        # download_data(csv_filename, curr_start_dt.strftime("%m/%d/%Y"),
        #                         curr_end_dt.strftime("%m/%d/%Y"),
        #                         NYISOReportKEY.RealTime)

        zones_not_present = set()
        if os.path.isfile(csv_filename):
            fp = open(csv_filename, "r")
            csv_reader = csv.DictReader(fp)
            for row in csv_reader:
                lmp = get_lmp_instance(row)
                if lmp:
                    lmp.persist()
                else:
                    zone_name = row["Zone Name"].lower()
                    zones_not_present.add(zone_name)

        print("Zones not present: {}".format(zones_not_present))

        curr_start_dt += delta


if __name__ == "__main__":
    run()