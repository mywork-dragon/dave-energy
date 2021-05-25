
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
DOWNLOAD_DIR = f'{BASEDIR}/downloaded_files'
UNZIP_FILES_DIR = f'{BASEDIR}/unzip_files'
CSV_FILES_DIR = f'{BASEDIR}/csv_files'

SETTLEMENT_POINT_NAMES = ["HB_HOUSTON", "HB_NORTH", "HB_SOUTH", "HB_WEST", "LZ_HOUSTON", "LZ_NORTH",
                          "LZ_SOUTH", "LZ_WEST"]
SETTLEMENT_POINT_TYPE = ["LZ", "HU"]

def unzip_files(download_dir, unzip_dir):
    is_real_time = None
    if not os.path.exists(unzip_dir):
        os.makedirs(unzip_dir)
    
    for zipped_file_name in os.listdir(download_dir):
        zipped_file = download_dir + "/" + zipped_file_name
        if zipfile.is_zipfile(zipped_file):
            try:
                with zipfile.ZipFile(zipped_file, 'r') as zip_ref:
                    zip_ref.extractall(unzip_dir)
                    print(f'{zipped_file} unziped successfully!')
            except Exception as err:
                print(err)

            if is_real_time is None:
                is_real_time = "RTM" in zipped_file_name

    return is_real_time

def excel_to_csv(unzipped_dir, csv_dir):
    if not os.path.exists(csv_dir):
        os.makedirs(csv_dir)
    for excel_file in os.listdir(unzipped_dir):
        if excel_file.endswith("xlsx"):
            read_file = pd.ExcelFile(
                f'{unzipped_dir}/{excel_file}', engine='openpyxl')
            csv_file = excel_file.replace('.xlsx', '.csv')


            file_path = os.path.join(csv_dir, csv_file)
            if not os.path.isfile(file_path):
                sheet_data = [read_file.parse(sheet)
                            for sheet in read_file.sheet_names]
                df = pd.concat(sheet_data)
                df.to_csv(f'{csv_dir}/{csv_file}', encoding='utf-8', index=False)
                print(f'{csv_file} created')


def persist_to_db(csv_dir, is_real_time):
    for csv_file in os.listdir(csv_dir):
        csv_file = csv_dir + "/" + csv_file
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
                        lmp.persist()
                    all_rows_of_hour = []
                    curr_delivery_hr = None
                    curr_zone = None
            else:
                raise Exception("Delivery hour or Zone Name mismatch.")


def download_file(download_dir, url, filename, chunk_size=128):
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open('{}/{}'.format(download_dir, filename), 'wb') as fl:
            for chunk in response.iter_content(chunk_size=chunk_size):
                fl.write(chunk)
    else:
        print(f"{filename} download failed with status code : {response.status_code}")


def run(is_real_time):
    download_dir = os.path.join(DOWNLOAD_DIR, "real_time" if is_real_time else "day_ahead")
    unzip_dir = os.path.join(UNZIP_FILES_DIR, "real_time" if is_real_time else "day_ahead")
    csv_dir = os.path.join(CSV_FILES_DIR, "real_time" if is_real_time else "day_ahead")

    payload = {
        "showHTMLView": "",
        "mimicKey": "",
    }
    if is_real_time:
        payload["reportTypeId"] = "13061"
        payload["reportTitle"] = "Historical RTM Load Zone and Hub Prices"
    else:
        payload["reportTypeId"] = "12331"
        payload["reportTitle"] = "DAM Settlement Point Prices"
    
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
                file_path = os.path.join(download_dir, filename)
                if not os.path.isfile(file_path):
                    download_file(download_dir, file_url, filename, chunk_size=128)
            
            except Exception as err:
                print(err)
    else:
        print(f"Request failed with status code : {response.status_code}")
    
    is_real_time = unzip_files(download_dir, unzip_dir)
    excel_to_csv(unzip_dir, csv_dir)
    persist_to_db(csv_dir, is_real_time)


if __name__ == "__main__":
    # TODO: Check xml files, check file format
    # Real time
    run(True)

    # # Day Ahead
    # run(False)