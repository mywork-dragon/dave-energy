# type: ignore

import redis
from typing import Any, Optional

from config import current_config as config


class RedisCache:
    instance = None

    def __init__(self):
        if RedisCache.instance is not None:
            raise Exception(
                "RedisCache is supposed to be instantiated only once. Please use get_instance() for accessing the Singleton."
            )

        if config.REDIS_SETTINGS != {}:
            rs = config.REDIS_SETTINGS
            self.r = redis.Redis(
                username=rs["username"],
                password=rs["password"],
                host=rs["host"],
                port=rs["port"],
                db=rs["db"],
            )
        else:
            self.r = None

    def get(self, key_name: str) -> Optional[bytes]:
        if self.r:
            return self.r.get(key_name)
        else:
            return None

    def expire(self, key_name: str, val: float) -> None:
        if self.r:
            self.r.expire(key_name, val)

    def set(self, key_name: str, val: Any) -> None:
        if self.r:
            self.r.set(key_name, val)

    @staticmethod
    def get_instance():
        if RedisCache.instance is None:
            RedisCache.instance = RedisCache()

        return RedisCache.instance
