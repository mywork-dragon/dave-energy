import os
from typing import Any, Dict
import logging
import urllib3


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    if SQLALCHEMY_DATABASE_URI:
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("://", "ql://", 1)
    DEBUG = False
    TESTING = False
    LOG_LEVEL = "INFO"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "thisisasecretkey")
    NIAGARA4_SERVER = os.getenv("NIAGARA4_SERVER", "")  # type: str
    NIAGARA4_USERNAME = os.getenv("NIAGARA4_USERNAME", "")  # type: str
    NIAGARA4_PASSWORD = os.getenv("NIAGARA4_PASSWORD", "")  # type: str
    WEATHER_PUBLIC_KEY = os.getenv("WEATHER_PUBLIC_KEY", "")  # type: str
    UTILITY_AUTHORIZATION_TOKEN = os.getenv(
        "UTILITY_AUTHORIZATION_TOKEN", "05f3adafe5e74fa887f40360622bb29d"
    )  # type: str
    UTILITY_BASE_URL = "https://utilityapi.com/api/v2/"
    # set color for admin page
    FLASK_ADMIN_SWATCH = "cerulean"
    URL = "http://localhost:5000/"

    SOLAR_API_KEY = "0N4ANOHIT88WFQH2ARW52J1OBESPJG1I"
    SOLAR_SITE_ID = "890122"

    HEATWATCH_BUCKET_NAME = "heatwatch-public-export"
    HEATWATCH_ACCESS_KEY = "AKIA2HTY62BJCQKGCWPY"
    HEATWATCH_SECRET_KEY = "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"

    DATADOG_OPTIONS = {"statsd_host": "127.0.0.1", "statsd_port": 8125}

    REDIS_SETTINGS = {}  # type: Dict[str, Any]

    SESSION_COOKIE_HTTPONLY = False

    EMAIL_SERVER = "smtp.gmail.com"
    EMAIL_PORT = 587


try:
    from localconfig import LOCAL_SQLALCHEMY_DATABASE_URI
except ModuleNotFoundError:
    LOCAL_SQLALCHEMY_DATABASE_URI = "postgres://localhost/denergy"


class LocalConfig(Config):
    DEBUG = True
    LOG_LEVEL = "DEBUG"
    SQLALCHEMY_DATABASE_URI = LOCAL_SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_DATABASE_URI = "postgres://ubk13i67opjdcm:p820503e85984ba2f393ab2a1626c33efc1af500005d14ed2caf91920689bd925@ec2-54-87-95-210.compute-1.amazonaws.com:5432/da9ljnoshn10ga"

    NIAGARA4_SERVER = "https://23.24.87.6:443"
    NIAGARA4_USERNAME = "Energy"
    NIAGARA4_PASSWORD = "control2555"

    CLIMACELL_API_KEY = os.getenv(
        "CLIMACELL_API_KEY", "0fZTgVvwk1q3HQfaBFVU3DR1p0ozRzG4"
    )


class TestingConfig(Config):
    ENV = "testing"
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://postgres:password@localhost/denergy_test"
    )
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgres://ubk13i67opjdcm:p820503e85984ba2f393ab2a1626c33efc1af500005d14ed2caf91920689bd925@ec2-54-87-95-210.compute-1.amazonaws.com:5432/da9ljnoshn10ga"
    )

    NIAGARA4_SERVER = "https://34.203.113.170:443"
    NIAGARA4_USERNAME = "daniel"
    NIAGARA4_PASSWORD = "daniel2"

    SOLAR_INVERTER_NAME = "inverter2"
    SOLAR_INVERTER_SERIAL = "7E142D69-28"

    CLIMACELL_API_KEY = os.getenv(
        "CLIMACELL_API_KEY", "0fZTgVvwk1q3HQfaBFVU3DR1p0ozRzG4"
    )


class StagingConfig(Config):
    LOG_LEVEL = "INFO"
    URL = "https://david-energy-staging.herokuapp.com/"

    REDIS_SETTINGS = {
        "username": "rediscloud",
        "password": "SAP7y3MvaqacvEvm81aYrEnYY3cblNkV",
        "host": "redis-18373.c89.us-east-1-3.ec2.cloud.redislabs.com",
        "port": 18373,
        "db": 0,
    }

    CLIMACELL_API_KEY = os.getenv(
        "CLIMACELL_API_KEY", "0fZTgVvwk1q3HQfaBFVU3DR1p0ozRzG4"
    )


class ProductionConfig(Config):
    LOG_LEVEL = "INFO"
    URL = "https://david-energy.herokuapp.com/"

    CLIMACELL_API_KEY = os.getenv(
        "CLIMACELL_API_KEY", "0fZTgVvwk1q3HQfaBFVU3DR1p0ozRzG4"
    )


DEVELOPMENT = "development"
TESTING = "testing"
STAGING = "staging"
PRODUCTION = "production"
SCHEDULED_JOBS = "scheduled_jobs"


config_map = {
    DEVELOPMENT: LocalConfig,
    TESTING: TestingConfig,
    STAGING: StagingConfig,
    PRODUCTION: ProductionConfig,
    SCHEDULED_JOBS: ProductionConfig,
}


current_config = config_map[os.getenv("FLASK_ENV")]  # type: ignore

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def _get_logger(log_level: str) -> logging.Logger:
    logging.basicConfig(
        level=log_level, format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logging.getLogger("botocore").setLevel("INFO")
    logging.getLogger("datadog").setLevel("INFO")
    logging.getLogger("pyhaystack").setLevel("INFO")
    logging.getLogger("urllib3.connectionpool").setLevel("INFO")
    logger = logging.getLogger(__name__)
    return logger

logger = _get_logger(current_config.LOG_LEVEL)  # type: logging.Logger