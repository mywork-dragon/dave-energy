
import csv
from datetime import datetime, timedelta
import sys

from scheduled_jobs.http_reads.dataminer2 import dataminer2
from scheduled_jobs.http_reads.lmp import LMP
from scheduled_jobs.trulight_energy.reference_data import ReferenceData


DT_FORMAT = "%m/%d/%Y %I:%M:%S %p"

Dataminer_To_DE = {
    "duke": "deok",
}

def run():
    # Download the file
    file_name = dataminer2.download_da_hr_lmp()

    # Loop through the rows, convert row to LMP object, persist to db
    zones = set()
    with open(file_name, "r") as fp:
        csv_reader = csv.DictReader(fp)
        for row in csv_reader:
            lmp = get_instance(row)
            if lmp:
                lmp.persist()
            else:
                zones.add(row["zone"].lower())

    print(zones)


def get_instance(row_dict):
    if row_dict["datetime_beginning_ept"] is None:
        print("Beginning time is empty.")
        return None
    ts_beginning = datetime.strptime(row_dict["datetime_beginning_ept"], DT_FORMAT)
    is_real_time = False
    price_key_name = "total_lmp_da"
    if "total_lmp_rt" in row_dict:
        is_real_time = True
        price_key_name = "total_lmp_rt"

    price = row_dict[price_key_name]

    zone_name = row_dict["pnode_name"].split("_")[0].lower()
    if zone_name in Dataminer_To_DE:
        zone_name = Dataminer_To_DE[zone_name]
    zone_id = ReferenceData.get_instance().get_zone_id(zone_name)
    if zone_id:
        dt = ts_beginning.date()
        hr_ending = ts_beginning.hour
        if hr_ending == 0:
            hr_ending = 24
            dt = (ts_beginning - timedelta(hours=24)).date()
        
        return LMP(dt, price, is_real_time, hr_ending, zone_id, zone_name)
    else:
        return None


if __name__ == "__main__":
    run()