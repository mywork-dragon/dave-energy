
import csv
import requests
from datetime import date, timedelta, datetime
import os

from scheduled_jobs.http_reads.lmp import LMP
from scheduled_jobs.http_reads.dataminer2.read_dataminer_lmp import get_instance

BASE_URL = "https://api.pjm.com/api/v1/{}?startRow=1&isActiveMetadata=true&datetime_beginning_ept={}%2000:00to{}&format=csv&download=true"
PRICING_NODE_IDS = ["116472927", "1269364670", "116472931", "1258625176", "116472933", "116472935", "116472937", "1069452904",
                    "116472939", "116472941", "116472943", "116472945", "116472947", "116472949", "116472951", "116472953", "116472957", "116472959"]
BASEDIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOAD_DIR = f'{BASEDIR}/dataminr/downloaded_files'


def download_data(url, filename, start_date, end_date):
    print("Downloading file for data from, {} to, {}".format(start_date, end_date))

    sub_response = requests.get(
        'https://dataminer2.pjm.com/config/settings.json')
    data = sub_response.json()
    subscriptionKey = data['subscriptionKey']
    headers = {
        'Accept': 'application/json, text/plain, */* ',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'api.pjm.com',
        'If-Modified-Since': 'Tue, 20 Apr 2021 04:30:22 GMT',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Origin': 'https://dataminer2.pjm.com',
        'Referer': 'https://dataminer2.pjm.com/',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/6.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        decoded_content = response.content.decode('utf-8')
        csv_reader = csv.DictReader(decoded_content.splitlines())
        header = csv_reader.fieldnames

        with open(filename, 'w') as fl:
            writer = csv.DictWriter(fl, fieldnames=header)
            writer.writeheader()
            for row in csv_reader:
                if row['pnode_id'] in PRICING_NODE_IDS:
                    writer.writerow(row)
    else:
        print(f"Downloading failed - {response.status_code}")


def run(download_day_ahead):
    start_date = datetime(2018, 6, 1).date()
    end_date = datetime.now().date()
    delta = timedelta(days=1)
    curr_start_dt = start_date

    download_dir = os.path.join(DOWNLOAD_DIR, "day_ahead" if download_day_ahead else "real_time")
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    while curr_start_dt < end_date:
        curr_end_dt = curr_start_dt + delta
        csv_filename = f'{download_dir}/{str(curr_start_dt).replace("/", "-")}.csv'
        if not os.path.isfile(csv_filename):
            final_url = BASE_URL.format("da_hrl_lmps" if download_day_ahead else "rt_hrl_lmps",
                                        curr_start_dt,
                                        curr_end_dt)
            try:
                download_data(final_url, csv_filename, curr_start_dt, curr_end_dt)
            except:
                print('Error while downloading file for {} to {}'.format(curr_start_dt, curr_end_dt))
                continue

        # if os.path.isfile(csv_filename):
        #     fp = open(csv_filename, "r")
        #     csv_reader = csv.DictReader(fp)
        #     for row in csv_reader:
        #         print(row)
        #         lmp = get_instance(row)
        #         if lmp:
        #             lmp.persist()

        curr_start_dt += delta


if __name__ == "__main__":
    # Real time
    run(False)