
import os
import requests

from config import logger
from config import PRODUCTION, SCHEDULED_JOBS
from aws.secrets_manager import SecretsManager, SecretName

from typing import Any


def send_alert(message: Any) -> None:
    if not os.getenv("FLASK_ENV") in [PRODUCTION, SCHEDULED_JOBS]:
        return

    message = "Slack Alert.............\n{}".format(message)
    data = {"text": message}
    resp = requests.post(
        SecretsManager.get_instance().get_secret(SecretName.SlackWebhookUrl)["slack_webhook_url"],
        json=data,
    )

    if resp.status_code != 200:
        logger.warning(
            "When sending Slack alert, got response code: {}, response text: {}".format(
                resp.status_code, resp.text
            )
        )


if __name__ == "__main__":
    send_alert(
        "This is a test. This channel will be used by our backend to alert us when major issues happen."
    )
