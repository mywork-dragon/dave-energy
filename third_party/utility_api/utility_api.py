# type: ignore

from enum import Enum

import json
import requests

from config import logger
from aws.secrets_manager import SecretsManager, SecretName
from data.cache.redis_cache import RedisCache


class Endpoint(Enum):
    BILLS_ENDPOINT = '/bills'
    METERS_ENDPOINT = '/meters'


class UtilityAPI:

    BASE_URL = 'https://utilityapi.com'
    VERSION_URL = '/api/v2'
    singleton = None

    def __init__(self):
        self.access_token = SecretsManager.get_instance().get_secret(SecretName.UtilityApi)['access_token']
        self.redis_cache = RedisCache.get_instance()

        self.service_address_to_meter_uids = {}

    def _append_auth_params(self, url: str):
        return '{}?access_token={}'.format(url, self.access_token)

    def _make_request(self, url):
        resp = self.redis_cache.get(url)
        if resp is None:
            response = requests.request("GET", url)
            resp = response.text
            if resp:
                self.redis_cache.set(url, resp)

        return resp


    def _init_meter_data(self):
        url = '{}{}{}'.format(self.BASE_URL, self.VERSION_URL, Endpoint.METERS_ENDPOINT.value)
        url = self._append_auth_params(url)
        meters = json.loads(self._make_request(url))['meters']

        for meter in meters:
            if not meter['is_activated']:
                continue

            if not meter['base']['service_address'] in self.service_address_to_meter_uids:
                self.service_address_to_meter_uids[meter['base']['service_address']] = []

            self.service_address_to_meter_uids[meter['base']['service_address']].append(meter['uid'])


    def get_meter_uids(self, building_addresses: list):
        if not self.service_address_to_meter_uids:
            # First load
            self._init_meter_data()

        meter_uids = set()
        for address in building_addresses:
            address_found = False
            for service_addr in self.service_address_to_meter_uids.keys():
                # Second part of the condition below is to support one building of Bettina, which has two meters
                # the meters have slightly different address
                if service_addr.startswith(address) or address.lower() in service_addr.lower():
                    meter_uids.update(self.service_address_to_meter_uids[service_addr])
                    address_found = True

            if not address_found:
                logger.debug('Data access for building, {}, is possibly not activated, no meter uid found.'.format(address))

        return meter_uids


    def get_bill_data(self, building_addresses: list):
        meters = self.get_meter_uids(building_addresses)
        if not meters:
            raise Exception("No meters were found for the building address:{}".format(building_addresses))

        url = '{}{}{}'.format(self.BASE_URL, self.VERSION_URL, Endpoint.BILLS_ENDPOINT.value)
        url = self._append_auth_params(url)
        url = '{}&meters={}'.format(url, ','.join(meters))
        return json.loads(self._make_request(url))['bills']

    @staticmethod
    def get_instance():
        if UtilityAPI.singleton is None:
            UtilityAPI.singleton = UtilityAPI()

        return UtilityAPI.singleton