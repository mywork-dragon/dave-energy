import json
import requests
from typing import Any, Dict, List

from config import current_config as config
from common.constants import CLOUD_COVER, TEMPERATURE
from common.utils import get_lat_lon


class Weather(object):
    def __init__(self) -> None:
        super(Weather, self).__init__()
        self.CLIMACELL_VERSION = "v3"
        self.CLIMACELL_URL_FORMAT = (
            "https://api.climacell.co/{version}/weather/{time_window}"
        )
        self.CLIMACELL_QUERYSTRING = {
            "unit_system": "us",
            # "unit_system" : "si",
            "start_time": "now",
            "apikey": config.CLIMACELL_API_KEY,
        }

    def get_hourly_forecast_url(self) -> str:
        # <= 96hr out
        return self.CLIMACELL_URL_FORMAT.format(
            version=self.CLIMACELL_VERSION, time_window="forecast/hourly"
        )

    def get_daily_forecast_url(self) -> str:
        # <= 15d out
        return self.CLIMACELL_URL_FORMAT.format(
            version=self.CLIMACELL_VERSION, time_window="forecast/daily"
        )

    def get_querystring(self, zipcode: str, climacell_field: str) -> Dict[str, Any]:
        lat, lon = get_lat_lon(zipcode)
        querystring = {
            "fields": "temp",
            "lat": lat,
            "lon": lon,
        }
        querystring.update(self.CLIMACELL_QUERYSTRING)
        querystring["fields"] = climacell_field

        return querystring

    def get_temp_next_96_hours(self, zipcode: str) -> List[Dict[str, Any]]:
        """
        For the zipcode returns the hourly temperature forecast for next 96hrs
        """
        url = self.get_hourly_forecast_url()
        querystring = self.get_querystring(zipcode, TEMPERATURE)

        response = requests.request("GET", url, params=querystring)
        temp_and_times = []
        for item in json.loads(response.text):
            temp_and_time = {}
            temp_and_time["temp"] = item["temp"]["value"]
            temp_and_time["time"] = item["observation_time"]["value"]

            temp_and_times.append(temp_and_time)

        return temp_and_times

    def get_temp_next_15_days(self, zipcode: str) -> List[Dict[str, Any]]:
        """
        For the zipcode returns the daily min and max temperature forecast for next 15 days
        """
        url = self.get_daily_forecast_url()
        querystring = self.get_querystring(zipcode, TEMPERATURE)

        response = requests.request("GET", url, params=querystring)
        dates_and_temperatures = []
        for item in json.loads(response.text):
            date_and_temps = {}
            date_and_temps["date"] = item["observation_time"]["value"]
            for temp in item["temp"]:
                if "min" in temp:
                    date_and_temps["min"] = temp["min"]["value"]
                elif "max" in temp:
                    date_and_temps["max"] = temp["max"]["value"]

            dates_and_temperatures.append(date_and_temps)

        return dates_and_temperatures

    def get_cloud_cover_next_96_hours(self, zipcode: str) -> List[Dict[str, Any]]:
        """
        For the zipcode returns the hourly cloud cover forecast for next 96hrs
        """
        url = self.get_hourly_forecast_url()
        querystring = self.get_querystring(zipcode, CLOUD_COVER)

        response = requests.request("GET", url, params=querystring)
        cc_and_times = []
        for item in json.loads(response.text):
            cc_and_time = {}
            cc_and_time["cloud_cover"] = item["cloud_cover"]["value"]
            cc_and_time["time"] = item["observation_time"]["value"]

            cc_and_times.append(cc_and_time)

        return cc_and_times


weather = Weather()
