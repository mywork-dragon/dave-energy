
import pytz
import requests
import urllib.parse
from datetime import datetime
import pytz

from config import logger
from data.db_connection import DBConnection

'''
    Solar Edge API works with EST, make sure you pass in EST, but persist in UTC in our database
'''

class SolarEdge:

    API_BASE_URL = 'https://monitoringapi.solaredge.com/site/{site_number}/{data_type}?api_key={api_key}'
    POWER_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
    ENERGY_DT_FORMAT = "%Y-%m-%d"
    EST_TZ = 'America/New_York'

    def __init__(self, site_id, api_key):
        self.site_id = site_id
        self.api_key = api_key

    def _get_power_url(self, from_dt_est, to_dt_est):
        url = SolarEdge.API_BASE_URL.format(site_number=self.site_id, data_type='power', api_key=self.api_key)
        from_dt_est = from_dt_est.strftime(SolarEdge.POWER_DATETIME_FORMAT)
        to_dt_est = to_dt_est.strftime(SolarEdge.POWER_DATETIME_FORMAT)
        qs = '&startTime={start_time}&endTime={end_time}'.format(start_time=from_dt_est.replace(" ", "%20"),
                                                                 end_time=to_dt_est.replace(" ", "%20"))
        url = '{url}{query_string}'.format(url=url, query_string=qs)
        return url

    def _get_energy_url(self, from_dt_est, to_dt_est):
        url = SolarEdge.API_BASE_URL.format(site_number=self.site_id, data_type='energy', api_key=self.api_key)
        from_dt_est = from_dt_est.strftime(SolarEdge.ENERGY_DT_FORMAT)
        to_dt_est = to_dt_est.strftime(SolarEdge.ENERGY_DT_FORMAT)
        qs = '&timeUnit={time_unit}&startDate={start_date}&endDate={end_date}'.format(
             time_unit=urllib.parse.quote('QUARTER_OF_AN_HOUR'),
             start_date=urllib.parse.quote(from_dt_est),
             end_date=urllib.parse.quote(to_dt_est))
        url = '{url}{query_string}'.format(url=url, query_string=qs)
        return url

    def get_power_data(self, from_dt_est,
                       to_dt_est=None,
                       return_tz="UTC"):
        logger.info('Requesting power data from Solar Edge.')
        if not to_dt_est:
            to_dt_est = datetime.now(pytz.timezone(SolarEdge.EST_TZ))
        resp = requests.get(self._get_power_url(from_dt_est, to_dt_est))
        self._check_response(resp)
        return self._get_values(resp.json()["power"]["values"], return_tz)

    def get_energy_data(self, from_dt_est,
                        to_dt_est=None,
                        return_tz="UTC"):
        if not to_dt_est:
            to_dt_est = datetime.now(pytz.timezone(SolarEdge.EST_TZ))
        logger.info('Requesting energy data from Solar Edge.')
        resp = requests.get(self._get_energy_url(from_dt_est, to_dt_est))
        self._check_response(resp)
        return self._get_values(resp.json()["energy"]["values"], return_tz)

    def _check_response(self, http_resp):
        if http_resp.status_code == 429:
            raise Exception('Rate limit message from Solar Edge, please refer to API docs for \'Usage Limitations\': {}'.format(http_resp.text))
        if http_resp.status_code != 200:
            raise Exception('Non 200 status code response from Solar Edge: {}, {}'.format(http_resp.status_code, http_resp.text))
        return

    def _get_values(self, values_in_resp, time_zn):
        tz = pytz.timezone(time_zn)
        values = []
        for val in values_in_resp:
            if val["value"] is not None:
                val_and_dt = {}
                dt = datetime.strptime(val["date"], SolarEdge.POWER_DATETIME_FORMAT)
                dt_in_tz = dt.astimezone(tz)
                val_and_dt = {
                    'dt': dt_in_tz,
                    'value': float(val["value"])
                }
                values.append(val_and_dt)
        return values


# from datetime import datetime, timedelta

# if __name__ == '__main__':
#     se = SolarEdge(5)

#     tz = pytz.timezone("America/New_York")
#     to_dt_est = datetime.now().astimezone(tz)
#     from_dt_est = to_dt_est - timedelta(days=7)

#     print(se.get_energy_data(from_dt_est, to_dt_est))