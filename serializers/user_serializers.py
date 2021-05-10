from datetime import date
from marshmallow import Schema, fields, post_load, pre_dump

from models.history import History
from models.point import Point
from models.asset import Asset
from models.building import Building
from models.user import User

from common.utils import (
    est_to_utc_datetime,
    get_zero_hour_time,
    utc_to_est_datetime,
)
from app import ma


class EnergyAnnualDataRequestSchema(Schema):  # type: ignore
    year = fields.Integer(missing=date.today().year)


energy_annual_data_request_schema = EnergyAnnualDataRequestSchema()