import os

from typing import Type, Optional
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from sqlalchemy import MetaData
from flask_login import LoginManager

from flask_swagger_ui import get_swaggerui_blueprint
from config import current_config, SCHEDULED_JOBS
from models.shared import db


app = Flask(
    __name__, static_folder="./client/dist", template_folder="./client/build"
)  # type: Flask

SWAGGER_URL = "/swagger"  # URL for exposing Swagger UI (without trailing '/')
API_URL = "/static/swagger.json"  # Our API url (can of course be a local resource)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={"app_name": "David-Energy"},  # Swagger UI config overrides
)

if app.env == SCHEDULED_JOBS:
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ubk13i67opjdcm:p820503e85984ba2f393ab2a1626c33efc1af500005d14ed2caf91920689bd925@ec2-54-87-95-210.compute-1.amazonaws.com:5432/da9ljnoshn10ga'
else:
    app.config.from_object(current_config)
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
db.app = app
db.init_app(app)


def get_env() -> Optional[str]:
    return app.env


login_manager = LoginManager()  # type: LoginManager
login_manager.init_app(app)
migrate = Migrate(app, db)  # type: Migrate
ma = Marshmallow(app)  # type: Marshmallo


# Models
from models.company import Company
from models.unit import Unit
from models.user import User
from models.building import Building
from models.asset import Asset
from models.point import Point
from models.history import History
from models.dispatch import Dispatch
from models.billing_cycle import BillingCycle
from models.billing_peak import BillingPeak
from models.device import Device
from models.energy_star import EnergyStar
from models.bill_history import BillHistory
from models.solar_edge_credential import SolarEdgeCredential
from models.n4_credential import N4Credential
from models.asset_type import AssetType
from models.point_dispatch_revert import PointDispatchRevert
from models.dnv_forecast import DNVForecast

# Routes
import controller.user_routes
import controller.react_routes
import controller.building_routes
import controller.analytics_building_engineer.analytics_building_engineer_routes
import controller.weather_routes
import controller.analytics_management.aggregate_routes
import controller.analytics_management.chart_routes
import tools.controller.index_routes
import tools.controller.entity_get_routes
import tools.controller.entity_persist_routes
import tools.controller.bill_history_routes
import tools.controller.n4_credential_routes
import tools.controller.solar_edge_credential_routes
import tools.controller.point_routes
import tools.controller.point_checker_routes
import tools.controller.check_readiness_routes

import admin
