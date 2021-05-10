import os

import psycopg2
import psycopg2.extras
from types import TracebackType
from typing import Any, Iterable, List, Optional, Type

from aws.secrets_manager import SecretsManager, SecretName
from config import PRODUCTION, SCHEDULED_JOBS
from data.db_parent import DBParent


class DBConnection(DBParent):

    def __init__(self, is_local_db: bool = False) -> None:
        # if is_local_db or os.getenv("FLASK_ENV") == "development":
        if False:
            self.conn = psycopg2.connect("dbname=denergy_test")
        else:
            db_secret_name = SecretName.ProductionDB \
                if os.getenv("FLASK_ENV") in [PRODUCTION, SCHEDULED_JOBS] \
                else SecretName.StagingDB
            super(DBConnection, self).__init__(db_secret_name)