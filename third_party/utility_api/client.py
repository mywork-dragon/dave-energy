# type: ignore
from app import config
from services.api_client import Client


utility_api_client = Client(url=config.UTILITY_BASE_URL)