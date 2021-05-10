from config import current_config as config
from services.api_client import Client
from third_party.solar_edge.solar_constants import (
    BASEURL,
    OVERVIEW_ENDPOINT,
    POWER_ENDPOINT,
    ENERGY_ENDPOINT,
    EQUIPMENT_ENDPOINT,
    INVENTORY_ENDPOINT,
)
from typing import Any

"""
goal of this file is to "talk to" Solar Edge
get the config api key, site name from config.py
"""


class SolarEdge:
    def __init__(self, site_number: str, api_key: str):
        """
        Initiates SolarEdge API class for usage of specific endpoints

        Args--
                site_number: Number associated with SolarEdge Site

                api_key: The API key associated with SolarEdge Site
        Returns--
        """
        self.site_number = site_number
        self.api_key = api_key

        # Initiate api_client
        self.client = Client(BASEURL)

    def endpoint_solar(
        self, endpoint: Any, site_number: Any = None, serial_number: Any = None
    ) -> str:
        if endpoint == OVERVIEW_ENDPOINT:
            end_url = f"site/{self.site_number}/overview?size=6&searchText=Lyon&sortProperty=name&sortOrder=ASC"
        if endpoint == POWER_ENDPOINT:
            end_url = f"site/{self.site_number}/power?"
        if endpoint == ENERGY_ENDPOINT:
            end_url = f"site/{self.site_number}/energy?"
        if endpoint == INVENTORY_ENDPOINT:
            end_url = f"site/{self.site_number}/inventory?"
        if endpoint == EQUIPMENT_ENDPOINT:
            end_url = f"/equipment/{self.site_number}/{serial_number}/data?"
        return end_url

    def solar_edge(
        self, endpoint: Any, serial_number: Any = None, **kwargs: str
    ) -> Any:
        """
        Communicates with SolarEdge API
        Args--
                endpoint: provide endpoint desired to retrieve information from. Example: POWER_Endpoint
                serial_number: provide serial_number/Device ID if required
                **kwargs: pass additional parameters, such as startTime, endTime, start and end
        Returns--
                Returns a JSON body of the information
        """

        payload = {"api_key": f"{self.api_key}"}
        payload.update(kwargs)
        endpoint_out = self.endpoint_solar(endpoint, self.site_number, serial_number)
        req = self.client.api_request("GET", endpoint_out, payload)

        return req


client_session = SolarEdge(config.SOLAR_SITE_ID, config.SOLAR_API_KEY)
