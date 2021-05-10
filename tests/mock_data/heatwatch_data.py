from io import StringIO
import datetime
from dateutil.tz import tzutc
from typing import List, Any


heatwatch_list_object_response = {
    "ResponseMetadata": {
        "RequestId": "A9B6E0599C4641AB",
        "HostId": "msvelnV6dzyg13pF2Sz9nMyJoYnWvxjZawXoZC1NADp2F3nC47AuRy2xweX/1ZUilF/cPmLj5yE=",
        "HTTPStatusCode": 200,
        "HTTPHeaders": {
            "x-amz-id-2": "msvelnV6dzyg13pF2Sz9nMyJoYnWvxjZawXoZC1NADp2F3nC47AuRy2xweX/1ZUilF/cPmLj5yE=",
            "x-amz-request-id": "A9B6E0599C4641AB",
            "date": "Fri, 12 Jun 2020 04:16:08 GMT",
            "x-amz-bucket-region": "us-east-1",
            "content-type": "application/xml",
            "transfer-encoding": "chunked",
            "server": "AmazonS3",
        },
        "RetryAttempts": 0,
    },
    "IsTruncated": False,
    "Contents": [
        {
            "Key": "1580145721547_1591142827.csv",
            "LastModified": datetime.datetime(2020, 6, 3, 0, 7, 8, tzinfo=tzutc()),
            "ETag": '"ff6d26212ea3248c73e7d2bdf54d8260"',
            "Size": 2542,
            "StorageClass": "STANDARD",
        },
        {
            "Key": "1580145721547_1591143727.csv",
            "LastModified": datetime.datetime(2020, 6, 3, 0, 22, 8, tzinfo=tzutc()),
            "ETag": '"10e9a76d8b6af9c0819bcfefea0f2bd1"',
            "Size": 2526,
            "StorageClass": "STANDARD",
        },
    ],
    "Name": "heatwatch-public-export",
    "Prefix": "",
    "MaxKeys": 1000,
    "EncodingType": "url",
    "KeyCount": 785,
}
heatwatch_list_object_parsed = [
    {
        "Key": "1580145721547_1591142827.csv",
        "LastModified": datetime.datetime(2020, 6, 3, 0, 7, 8, tzinfo=tzutc()),
        "ETag": '"ff6d26212ea3248c73e7d2bdf54d8260"',
        "Size": 2542,
        "StorageClass": "STANDARD",
    },
    {
        "Key": "1580145721547_1591143727.csv",
        "LastModified": datetime.datetime(2020, 6, 3, 0, 22, 8, tzinfo=tzutc()),
        "ETag": '"10e9a76d8b6af9c0819bcfefea0f2bd1"',
        "Size": 2526,
        "StorageClass": "STANDARD",
    },
]


heatwatch_csv = StringIO(
    "Time,Status,Coil,DHW,Return Line,Well,Water,Stack,Average APT,323,340,342,302,310,308,347,311,326,325,341,348,301,339,322,309\n"
    "06/11 06:52PM,Fallback,131.02,126.58,78.93,ERR,0.00,83.30,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:53PM,Fallback,130.77,123.30,78.90,ERR,0.00,83.71,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:54PM,Fallback,130.71,132.10,78.96,ERR,0.00,83.71,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:55PM,Fallback,130.69,136.68,79.01,ERR,0.00,83.37,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:56PM,Fallback,131.04,125.64,79.03,ERR,0.00,83.30,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:57PM,Fallback,131.02,134.20,79.03,ERR,0.00,83.37,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:58PM,Fallback,130.94,131.15,78.96,ERR,0.00,83.57,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 06:59PM,Fallback,130.93,128.88,78.96,ERR,0.00,83.71,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:00PM,Fallback,131.09,123.50,78.96,ERR,0.00,83.77,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:01PM,Fallback,130.81,125.61,78.94,ERR,0.00,83.57,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:02PM,Fallback,130.75,130.22,78.90,ERR,0.00,83.71,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:03PM,Fallback,130.77,124.18,78.92,ERR,0.00,83.30,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:04PM,Fallback,130.68,127.76,78.92,ERR,0.00,83.44,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:05PM,Fallback,130.38,138.73,78.94,ERR,0.00,83.71,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
    "06/11 07:06PM,Fallback,131.12,124.64,78.98,ERR,0.00,83.50,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR,ERR\n"
)


def get_heatwatch_ts_data(
    Status_id: int,
    Coil_id: int,
    dhw_id: int,
    returnline_id: int,
    water_id: int,
    stack_id: int,
) -> List[Any]:
    return [
        {"point_id": Status_id, "ts": "2020-06-11 11:06:00",},
        {"point_id": Coil_id, "ts": "2020-06-11 11:06:00", "quantity": float(131.12),},
        {"point_id": dhw_id, "ts": "2020-06-11 11:06:00", "quantity": float(124.64),},
        {
            "point_id": returnline_id,
            "ts": "2020-06-11 11:06:00",
            "quantity": float(78.98),
        },
        {"point_id": water_id, "ts": "2020-06-11 11:06:00", "quantity": float(0.00),},
        {"point_id": stack_id, "ts": "2020-06-11 11:06:00", "quantity": float(83.50),},
    ]
