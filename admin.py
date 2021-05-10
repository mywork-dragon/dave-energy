from datetime import date, datetime
import pytz

from app import app, db
from common.constants import ADMIN_DATETIME_FORMAT
from models.user import User
from models.history import History
from models.building import Building
from models.asset import Asset
from models.point import Point
from models.dispatch import Dispatch
from models.billing_cycle import BillingCycle
from models.billing_peak import BillingPeak
from models.company import Company
from models.device import Device
from models.energy_star import EnergyStar

from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.model import typefmt


def date_12h_format(view: ModelView, value: datetime) -> str:
    return value.strftime(ADMIN_DATETIME_FORMAT)


def utc_to_est_convert(view: ModelView, value: datetime) -> str:
    est = pytz.timezone("US/Eastern")
    return pytz.utc.localize(value).astimezone(est).strftime(ADMIN_DATETIME_FORMAT)


DATE_12H_FORMATTERS = dict(typefmt.BASE_FORMATTERS)
DATE_12H_FORMATTERS[date] = date_12h_format


class UserModelView(ModelView):  # type: ignore
    column_display_pk = True
    column_type_formatters = DATE_12H_FORMATTERS

    column_searchable_list = ["email"]
    page_size = 50
    can_export = True
    column_exclude_list = ["password", "updated_at", "confirmed_at"]
    form_excluded_columns = ["updated_at", "confirmed_at", "created_at"]


class CustomModelView(ModelView):  # type: ignore
    column_display_pk = True
    column_type_formatters = DATE_12H_FORMATTERS
    page_size = 50
    column_exclude_list = ["created_at", "updated_at"]
    form_excluded_columns = ["created_at", "updated_at"]


class DispatchModelView(ModelView):  # type: ignore
    dispatch_formatters = dict(typefmt.BASE_FORMATTERS)
    dispatch_formatters[date] = utc_to_est_convert
    dispatch_formatters[datetime] = utc_to_est_convert

    column_display_pk = True
    column_type_formatters = dispatch_formatters
    page_size = 50
    column_exclude_list = ["created_at", "updated_at"]
    form_excluded_columns = ["created_at", "updated_at"]


class PointModelView(ModelView):  # type: ignore
    column_display_pk = True
    column_type_formatters = DATE_12H_FORMATTERS
    page_size = 50
    column_exclude_list = ["created_at", "updated_at", "history"]
    form_excluded_columns = ["created_at", "updated_at", "history"]


# admin
admin = Admin(app, name="David Energy Admin", template_mode="bootstrap3")
admin.add_view(UserModelView(User, db.session))
admin.add_view(CustomModelView(History, db.session))
admin.add_view(CustomModelView(Building, db.session))
admin.add_view(CustomModelView(Asset, db.session))
admin.add_view(PointModelView(Point, db.session))
admin.add_view(DispatchModelView(Dispatch, db.session))
admin.add_view(CustomModelView(BillingCycle, db.session))
admin.add_view(CustomModelView(BillingPeak, db.session))
admin.add_view(CustomModelView(Company, db.session))
admin.add_view(CustomModelView(Device, db.session))
admin.add_view(CustomModelView(EnergyStar, db.session))