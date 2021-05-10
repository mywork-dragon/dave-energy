from enum import Enum
from typing import Dict

import boto3
import json


class SecretName(Enum):
    DegreeDays = "third_party/degree_days"
    UtilityApi = "third_party/utilityapi"
    Memcachier = "memcachier"
    StagingDB = "staging_db"
    ProductionDB = "production_db"
    SlackWebhookUrl = "slack_webhook_url"
    MycorSupportEmail = "email_mycor_support"
    DNVFTPCredentials = "dnv_ftp_credentials"
    PortfolioManager = "portfolio_manager"
    TrulightEnergyAPICredentials = "trulight_energy_api_credentials"
    ProductionEnergyCurvesDB = "production_energy_curves_db"
    SendGridAPIKey = "sendgrid_api_key"


REGION_NAME = "us-east-1"


class SecretsManager:

    instance = None

    def __init__(self) -> None:
        if not SecretsManager.instance is None:
            raise Exception(
                "SecretsManager is supposed to be instantiated only once. Please use get_instance() for accessing the Singleton."
            )

        self.name_to_secret: Dict[str, str] = {}
        self.session = boto3.session.Session()

    def get_secret(self, secret_name: SecretName) -> Dict[str, str]:
        if secret_name.value in self.name_to_secret:
            return dict(json.loads(self.name_to_secret[secret_name.value]))

        client = self.session.client(
            service_name="secretsmanager", region_name=REGION_NAME
        )
        secret_str = client.get_secret_value(SecretId=secret_name.value)["SecretString"]
        self.name_to_secret[secret_name.value] = secret_str

        return dict(json.loads(secret_str))

    @staticmethod
    def get_instance():
        if SecretsManager.instance is None:
            SecretsManager.instance = SecretsManager()

        return SecretsManager.instance


if __name__ == "__main__":
    dd_keys = SecretsManager.get_instance().get_secret(SecretName.UtilityApi)
    print(dd_keys)
