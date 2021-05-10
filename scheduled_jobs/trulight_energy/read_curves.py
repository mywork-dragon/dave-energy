
import urllib3
import json
import traceback

from aws.secrets_manager import SecretsManager, SecretName
from config import logger
from common import slack
from data.db_connection import DBConnection


class ReadCurves:

    BASE_URL = "https://api.prod.truelightenergy.com"
    TOKEN_URL = "/api/Token"

    def read(self, forward_curve_url):
        logger.info("Inside ReadForwardCurves.read()")
        token = self._get_token()
        logger.info("Trulight Energy token read.")
        forward_curves = self._read_curves(token, forward_curve_url)
        logger.info("Forward curves read, count of records: {}".format(len(forward_curves["model"])))

        return forward_curves["model"]


    def _get_token(self):
        api_credentials = SecretsManager.get_instance().get_secret(SecretName.TrulightEnergyAPICredentials)
        encoded_body = json.dumps({
            "userName": api_credentials["username"],
            "secret": api_credentials["password"]
        })
        http = urllib3.PoolManager()
        resp = http.request('POST', '{}{}'.format(ReadCurves.BASE_URL,
                                                  ReadCurves.TOKEN_URL),
                 headers={'Content-Type':'application/json'},
                 body=encoded_body)
        return json.loads(resp.data)["accessToken"]


    def _read_curves(self, token, curve_url):
        http = urllib3.PoolManager()
        resp = http.request('GET', '{}{}'.format(ReadCurves.BASE_URL,
                                                 curve_url),
                            headers={'Authorization': 'Bearer {}'.format(token)})
        return json.loads(resp.data)

if __name__ == "__main__":
    rfc = ReadCurves()
    curves = rfc.read("/api/CapacityCurve/NyIso")
    for curve in curves:
        print(curve)