import os

import psycopg2
import psycopg2.extras
from types import TracebackType
from typing import Any, Iterable, List, Optional, Type

from aws.secrets_manager import SecretsManager, SecretName
from config import PRODUCTION, SCHEDULED_JOBS
from data.db_parent import DBParent


class DBEnergyCurvesConnection(DBParent):

    def __init__(self) -> None:
        super(DBEnergyCurvesConnection, self).__init__(SecretName.ProductionEnergyCurvesDB)

        