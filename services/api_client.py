import json
import requests
from typing import Dict, Any, Optional
from requests import Request
from config import logger
from config import current_config as config


class Client:
    def __init__(self, url: str) -> None:
        self.url = url

    def api_request(
        self,
        method: str,
        endpoint: str,
        payload: Optional[Dict[Any, Any]] = None,
        headers: Optional[Dict[Any, Any]] = None,
    ) -> Optional[Dict[Any, Any]]:
        try:
            if method == "GET":
                req = Request(
                    "GET", self.url + endpoint, params=payload, headers=headers
                )
                prepared_req = req.prepare()  # type:ignore
                response = requests.get(prepared_req.url, headers=prepared_req.headers)

            elif method == "POST":
                response = requests.post(self.url + endpoint, json=payload)

            elif method == "PATCH":
                response = requests.patch(self.url + endpoint, json=payload)

            elif method == "DELETE":
                response = requests.delete(self.url + endpoint)

            else:
                raise Exception("method {} not allowed".format(method))

            response.raise_for_status()
            data = json.loads(response.content)
            return dict(data=data)

        except requests.exceptions.HTTPError as error:
            logger.error(response.text)
            raise error
        except Exception as error:
            logger.error(error)
            raise error


api_client = Client(url=config.URL)
