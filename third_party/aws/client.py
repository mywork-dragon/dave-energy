import boto3
from typing import Any


class S3:
    def __init__(self, bucket_name: str, access_key: str, secret_access_key: str):
        self.bucket_name = bucket_name
        self.access_key = access_key
        self.secret_access_key = secret_access_key
        client_name = "s3"
        self.session = boto3.client(
            client_name,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_access_key,
        )

    def get_all_contents(self) -> Any:
        list_response = self.session.list_objects_v2(
            Bucket=self.bucket_name, Prefix=""
        ).get("Contents")
        return list_response

    def read_latest_csv(self) -> Any:
        list_files = self.get_all_contents()
        # latest_file = max(list_response, key=lambda x: x['LastModified'])
        latest_file = list_files[-1]
        filename = latest_file["Key"]
        if (".csv" in filename) == True:
            obj = self.session.get_object(Bucket=self.bucket_name, Key=filename)
            read_obj = obj["Body"].read()
            csv_file = read_obj.decode("utf-8").splitlines()
        else:
            csv_file = None
        return csv_file
