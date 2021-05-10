
import json
from urllib.request import Request
import urllib.request
from io import BytesIO
import gzip

SETTINGS_JSON_URL = "https://dataminer2.pjm.com/config/settings.json"
DAY_AHEAD_HR_LMPS = "https://api.pjm.com/api/v1/da_hrl_lmps?format=csv&download=true"


def download_da_hr_lmp():
    print("Inside download_da_hr_lmp")
    # Read subscription key
    response = urllib.request.urlopen(SETTINGS_JSON_URL)
    contents = response.read()
    print("Dataminer2 subscription key read, downloading day ahead hourly LMPs...")

    req = Request(DAY_AHEAD_HR_LMPS)
    req.add_header('Ocp-Apim-Subscription-Key', json.loads(contents)["subscriptionKey"])
    req.add_header('Accept', "application/json, text/plain")
    req.add_header('Accept-Encoding', "gzip, deflate, br")
    req.add_header('Accept-Language', "en-US,en;q=0.9")
    req.add_header('Connection', "keep-alive")
    resp = urllib.request.urlopen(req)
    print("Download complete, writing to local file...")

    if resp.info().get('Content-Encoding') == 'gzip':
        buf = BytesIO(resp.read())
        f = gzip.GzipFile(fileobj=buf)
        content = f.read()
    else:
        content = resp.read()

    file_name = "da_hrl_lmps.csv"
    with open(file_name, 'wb') as fp:
        fp.write(content)
        print("Write to local file complete.")
        return file_name


if __name__ == "__main__":
    download_da_hr_lmp()