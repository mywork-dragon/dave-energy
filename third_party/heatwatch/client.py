from app import config
from third_party.aws.client import S3
from typing import Any


class Heatwatch:
    def __init__(self, bucket_name: str, access_key: str, secret_key: str):

        self.session = S3(bucket_name, access_key, secret_key)

    def s3_csv(self) -> Any:
        csv_file = self.session.read_latest_csv()
        return csv_file


heatwatch_session = Heatwatch(
    config.HEATWATCH_BUCKET_NAME,
    config.HEATWATCH_ACCESS_KEY,
    config.HEATWATCH_SECRET_KEY,
)
