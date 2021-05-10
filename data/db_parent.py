from enum import Enum
import os

import psycopg2
import psycopg2.extras
from types import TracebackType
from typing import Any, Iterable, List, Optional, Type

from aws.secrets_manager import SecretsManager, SecretName
from config import PRODUCTION, SCHEDULED_JOBS


class DBParent(object):

    def __init__(self, secret_name: SecretName):
        db_credentials = SecretsManager.get_instance().get_secret(secret_name)
        _connStr = "host={0} dbname={1} user={2} password={3}".format(
            db_credentials["host"],
            db_credentials["dbname"],
            db_credentials["username"],
            db_credentials["password"],
        )
        self.conn = psycopg2.connect(_connStr)

    def select_dict(self, sql: str, args: Iterable[Any] = []) -> List[psycopg2.extras.DictRow]:
        dictCursor = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        dictCursor.execute(sql, args)
        return list(dictCursor.fetchall())

    def execute(self, sql: str, args: Iterable[Any] = []) -> None:
        self.conn.cursor().execute(sql, args)
        self.conn.commit()

    def __enter__(self) -> "DBConnection":
        return self

    def __exit__(self, type: Optional[Type[BaseException]], value: Optional[BaseException], traceback: Optional[TracebackType],
    ) -> Optional[bool]:
        self.conn.close()
        return None


if __name__ == "__main__":
    with DBConnection(True) as conn:
        recs = conn.select_dict("select * from device")
        for rec in recs:
            print(rec["name"])

    # conn.execute("insert into company (name, url) values (%s, %s);", ("Betterment", "https://www.betterment.com/"))
