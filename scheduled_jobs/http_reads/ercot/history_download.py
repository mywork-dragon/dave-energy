
import csv
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import os
import requests
import zipfile  
import openpyxl
import pandas as pd

from bs4 import BeautifulSoup

from scheduled_jobs.http_reads.ercot.read_ercot_lmp import get_instance


BASE_URL = 'http://mis.ercot.com'
BASEDIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOADED_FILES = f'{BASEDIR}/downloaded_Files'
UNZIP_FILES_DIR = f'{BASEDIR}/unzip_files'
CSV_FILES_DIR = f'{BASEDIR}/csv_files'

SETTLEMENT_POINT_NAMES = ["HB_HOUSTON", "HB_NORTH", "HB_SOUTH", "HB_WEST", "LZ_HOUSTON", "LZ_NORTH",
                          "LZ_SOUTH", "LZ_WEST"]
SETTLEMENT_POINT_TYPE = ["LZ", "HU"]

def unzip_files():
    is_real_time = None
    if not os.path.exists(UNZIP_FILES_DIR):
        os.makedirs(UNZIP_FILES_DIR)
    for zipped_file_name in os.listdir(DOWNLOADED_FILES):
        zipped_file = DOWNLOADED_FILES + "/" + zipped_file_name
        if zipfile.is_zipfile(zipped_file):
            try:
                with zipfile.ZipFile(zipped_file, 'r') as zip_ref:
                    zip_ref.extractall(UNZIP_FILES_DIR)
                    print(f'{zipped_file} unziped successfully!')
            except Exception as err:
                print(err)

            if is_real_time is None:
                is_real_time = "RTM" in zipped_file_name

    return is_real_time

def excel_to_csv():
    if not os.path.exists(CSV_FILES_DIR):
        os.makedirs(CSV_FILES_DIR)
    for excel_file in os.listdir(UNZIP_FILES_DIR):
        if excel_file.endswith("xlsx"):
            read_file = pd.ExcelFile(
                f'{UNZIP_FILES_DIR}/{excel_file}', engine='openpyxl')
            csv_file = excel_file.replace('.xlsx', '.csv')
            sheet_data = [read_file.parse(sheet)
                        for sheet in read_file.sheet_names]
            df = pd.concat(sheet_data)
            df.to_csv(f'{CSV_FILES_DIR}/{csv_file}', encoding='utf-8', index=False)
            print(f'{csv_file} created')


def persist_to_db(is_real_time):
    for csv_file in os.listdir(CSV_FILES_DIR):
        csv_file = CSV_FILES_DIR + "/" + csv_file
        fp = open(csv_file, "r")
        csv_reader = csv.DictReader(fp)
        all_rows_of_hour = []
        curr_delivery_hr = None
        curr_zone = None
        for row in csv_reader:
            if not (row["Settlement Point Name"] in SETTLEMENT_POINT_NAMES and \
                    row["Settlement Point Type"] in SETTLEMENT_POINT_TYPE):
                continue

            if curr_delivery_hr is None:
                curr_delivery_hr = row["Delivery Hour"]
                curr_zone = row["Settlement Point Name"]
            print(row)
            if curr_delivery_hr == row["Delivery Hour"] and curr_zone == row["Settlement Point Name"]:
                all_rows_of_hour.append(row)
                if len(all_rows_of_hour) == 4:
                    lmp = get_instance(all_rows_of_hour, is_real_time)
                    if lmp:
                        print("LMP created")
                        # lmp.persist()
                    all_rows_of_hour = []
                    curr_delivery_hr = None
                    curr_zone = None
            else:
                raise Exception("Delivery hour or Zone Name mismatch.")


def download_file(url, filename, chunk_size=128):
    if not os.path.exists(DOWNLOADED_FILES):
        os.makedirs(DOWNLOADED_FILES)
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open('{}/{}'.format(DOWNLOADED_FILES, filename), 'wb') as fl:
            for chunk in response.iter_content(chunk_size=chunk_size):
                fl.write(chunk)
    else:
        print(f"{filename} download failed with status code : {response.status_code}")


def run():
    payload = {
        "reportTypeId": "13061",
        "reportTitle": "Historical RTM Load Zone and Hub Prices",
        "showHTMLView": "",
        "mimicKey": "",
    }
    final_url = f"{BASE_URL}/misapp/GetReports.do"
    response = requests.get(final_url, params=payload)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        titles = soup.find_all('td', {'class': 'labelOptional_ind'})
        links = soup.find_all('a', href=True)

        for i in range(len(links)):
            filename = titles[i].text
            link = links[i]['href']
            file_url = f"{BASE_URL}{link}"
            try:
                print(f"Downloading : {filename}")
                download_file(file_url, filename, chunk_size=128)
            
            except Exception as err:
                print(err)
    else:
        print(f"Request failed with status code : {response.status_code}")
    
    is_real_time = unzip_files()
    excel_to_csv()
    persist_to_db(is_real_time)


if __name__ == "__main__":
    run()