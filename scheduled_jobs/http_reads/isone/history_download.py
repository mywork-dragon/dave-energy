import csv
import os
import requests
from datetime import datetime, date, timedelta

from scheduled_jobs.http_reads.isone.read_isone_lmp import get_instance


BASE_URL = 'https://www.iso-ne.com/static-transform/csv/histRpts/da-lmp/WW_DALMP_ISO_{}.csv'
BASEDIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOADED_FILES = f'{BASEDIR}/downloaded_Files'

def download_csv(filepath, url):
    headers = {
        'User-Agent': 'Mozilla/6.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        decoded_content = response.content.decode('utf-8')
        print(f'Downloading csv file : {filepath}')
        with open(filepath, 'w') as fl:
            fl.write(decoded_content)
    else:
        raise Exception(f"Downloading failed - {response.status_code}")


def run():
    if not os.path.exists(DOWNLOADED_FILES):
        os.makedirs(DOWNLOADED_FILES)
    start_date = datetime(2014, 1, 1).date()
    end_date = datetime.now().date()
    delta = timedelta(days=1)
    while start_date <= end_date:
        plain_date = str(start_date).replace('-', '')
        filepath = os.path.join(DOWNLOADED_FILES, f'WW_DALMP_ISO_{plain_date}.csv')
        final_url = BASE_URL.format(plain_date)
        if not os.path.isfile(filepath):
            download_csv(filepath, final_url)
        start_date += delta

    persist_to_db()


def persist_to_db():
    is_real_time = True
    if "da-lmp" in BASE_URL:
        is_real_time = False
    
    for csv_file in os.listdir(DOWNLOADED_FILES):
        csv_file = DOWNLOADED_FILES + "/" + csv_file
        fp = open(csv_file, "r")
        # Skip top four rows
        next(fp)
        next(fp)
        next(fp)
        next(fp)

        csv_reader = csv.DictReader(fp)
        for row in csv_reader:
            lmp = get_instance(row, is_real_time)
            if lmp:
                lmp.persist()


if __name__ == "__main__":
    run()