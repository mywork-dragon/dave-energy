import requests
import csv
from datetime import datetime, timedelta
from enum import Enum

from scheduled_jobs.http_reads.lmp import LMP
from scheduled_jobs.trulight_energy.reference_data import ReferenceData

# https://www.nyiso.com/custom-reports?report=dam_lbmp_zonal
BASE_URL = "http://dss.nyiso.com/dss_oasis/PublicReports"
DT_FORMAT = "%Y/%m/%d %H:%M:%S"
ZONES = ['CAPITL', 'CENTRL', 'DUNWOD', 'GENESE', 'HUD VL', 'LONGIL', 'MHK VL', 'MILLWD', 'N.Y.C.', 'NORTH', 'WEST']

NYISO_To_DE = {
    "capitl": "zone f",
    "centrl": "zone c",
    "dunwod": "zone i",
    "genese": "zone b",
    "hud vl": "zone g",
    "longil": "zone k",
    "mhk vl": "zone e",
    "millwd": "zone h",
    "n.y.c.": "zone j",
    "north": "zone d",
    "west": "zone a",
}

class NYISOReportKEY(Enum):
    RealTime = "RT_LBMP_ZONE"
    DayAhead = "DAM_LBMP_ZONE"


def download_data(filename: str, start_date: str, end_date: str, report_key: NYISOReportKEY):
    print(f"Downloading csv file from, {start_date} to {end_date}")
    data = {
        'reportKey': report_key.value,
        'startDate': start_date,
        'endDate': end_date,
        'version': 'L',
        'dataFormat': 'CSV',
        'filter': ZONES,
    }
    response = requests.post(BASE_URL, data=data)
    if response.status_code == 200:
        decoded_content = response.content.decode('utf-8')
        with open(filename, 'w') as fl:
            fl.write(decoded_content)


def get_lmp_instance(row_dict, is_real_time):
    ts_beginning = None
    if "Eastern Date Hour" in row_dict:
        ts_beginning = datetime.strptime(row_dict["Eastern Date Hour"], DT_FORMAT)
    else:
        ts_beginning = datetime.strptime(row_dict["RTD End Time Stamp"], DT_FORMAT)
    price = None
    if "DAM Zonal LBMP" in row_dict:
        price = row_dict["DAM Zonal LBMP"]
    else:
        price = row_dict["RTD Zonal LBMP"]

    zone_name = row_dict["Zone Name"].lower()
    if zone_name in NYISO_To_DE:
        zone_name = NYISO_To_DE[zone_name]
    zone_id = ReferenceData.get_instance().get_zone_id(zone_name)
    if zone_id:
        dt = ts_beginning.date()
        hr_ending = ts_beginning.hour
        if hr_ending == 0:
            hr_ending = 24
            dt = (ts_beginning - timedelta(hours=24)).date()
    else:
        return None

    return LMP(dt, price, is_real_time, hr_ending, zone_id, zone_name)


def run():
    pass


if __name__ == "__main__":
    run()
