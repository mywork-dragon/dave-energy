from calendar import monthrange
from datetime import datetime, timedelta, date
from typing import Any, Optional, Callable, Tuple
import csv
import pytz
import smtplib
from flask_login import current_user
from functools import wraps
from typing import Any, List
import traceback

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Cc

from common.constants import (
    COMPLETE,
    FE_DATETIME_FORMAT,
    FE_DATETIME_FORMAT2,
    IN_ACTION,
    KWATT_MULTIPLIER,
    MONTH_DISPLAY,
    NEXT,
    TZ_DATETIME_FORMAT,
    WATT_MULTIPLIER,
    OTHER_MULTIPLIER,
)
from aws.secrets_manager import SecretsManager, SecretName
from data.db_connection import DBConnection
from models.point import Point
from common import constants
from config import current_config, logger
from common import slack


EMAIL_FORMAT = """\
From: {}
To: {}
Subject: {}
{}
"""


def is_number(string: str) -> bool:
    try:
        float(string)
        return True
    except (TypeError, ValueError):
        return False


def get_current_time() -> datetime:
    """
    returns current time in UTC format.
    """
    return datetime.utcnow()


def get_zero_hour_time(days: int = 0) -> datetime:
    """
    returns 12:0 am in UTC Format for the days mentioned from Today.
    """
    today_time = datetime.now()
    shifted_day = today_time + timedelta(days=days)
    shifted_day = shifted_day.replace(minute=0, hour=0, second=0, microsecond=0)
    return shifted_day


def get_fe_zero_hour_time_utc(days: int = 0) -> datetime:
    """
    Return 04:00/05:00 am in UTC, which corresponds to 12:00 am for frontend

    (Eastern time), shifted by a given amount of days from today.
    """
    frontend_time = datetime.now()
    frontend_time = frontend_time.replace(
        minute=0, hour=0, second=0, microsecond=0
    ) + timedelta(days=days)
    est = pytz.timezone("US/Eastern")
    localized_datetime = est.localize(frontend_time)
    return localized_datetime.astimezone(pytz.utc)


def get_today_date() -> date:
    """
    returns today date
    """
    return datetime.utcnow().date()


def get_last_year_date() -> date:
    """
    returns last year date
    """
    today = datetime.utcnow().date()
    return today.replace(year=today.year - 1)


def str_to_bool(text: str) -> Any:
    if text.lower() in ["true", "t"]:
        return True
    if text.lower() in ["false", "f"]:
        return False
    return text


def time_to_utc(time_entry: str, fmt: str = FE_DATETIME_FORMAT) -> str:
    """Convert string in Eastern time to string in UTC."""
    local = pytz.timezone("US/Eastern")
    try:
        datetime_obj = datetime.strptime(time_entry, fmt)
    except ValueError:
        datetime_obj = datetime.strptime(time_entry, FE_DATETIME_FORMAT2)
    localized_datetime = local.localize(datetime_obj)
    utc_dt = localized_datetime.astimezone(pytz.utc)

    return utc_dt.strftime(fmt)


def time_to_est(time_entry: str, fmt: str = FE_DATETIME_FORMAT) -> str:
    """Convert string in UTC to string in Eastern time."""
    local = pytz.timezone("US/Eastern")
    utc = pytz.utc
    try:
        datetime_obj = datetime.strptime(time_entry, fmt)
    except ValueError:
        datetime_obj = datetime.strptime(time_entry, FE_DATETIME_FORMAT2)
    localized_datetime = utc.localize(datetime_obj)
    est_dt = localized_datetime.astimezone(local)

    return est_dt.strftime(fmt)


def est_to_utc_datetime(est_datetime: datetime) -> datetime:
    """Convert EST datetime to UTC datetime."""
    est = pytz.timezone("US/Eastern")
    localized_datetime = est.localize(est_datetime)
    return localized_datetime.astimezone(pytz.utc)


def utc_to_est_datetime(utc_datetime: datetime) -> datetime:
    """Convert UTC datetime to EST datetime."""
    localized_datetime = pytz.utc.localize(utc_datetime)
    est = pytz.timezone("US/Eastern")
    return localized_datetime.astimezone(est)


def convert_str_to_est_with_tz(datetime_str: str) -> str:
    """Take datetime string either in TZ-naive UTC or TZ-aware EST,

    convert to TZ-aware EST string; this is done due to Marshmallow's
    inconsistent datetime handling."""

    try:
        # handle TZ-aware EST time string
        est_dt = datetime.strptime(datetime_str, TZ_DATETIME_FORMAT)
    except ValueError:
        try:
            # handle TZ-naive UTC time string
            datetime_obj = datetime.strptime(datetime_str, FE_DATETIME_FORMAT)
            localized_datetime = pytz.utc.localize(datetime_obj)
            est = pytz.timezone("US/Eastern")
            est_dt = localized_datetime.astimezone(est)
        except ValueError:
            # handle TZ-naive UTC time string
            datetime_obj = datetime.strptime(datetime_str, FE_DATETIME_FORMAT2)
            localized_datetime = pytz.utc.localize(datetime_obj)
            est = pytz.timezone("US/Eastern")
            est_dt = localized_datetime.astimezone(est)

    return est_dt.strftime(TZ_DATETIME_FORMAT)


def month_delta(date: date, delta: int) -> date:
    """
    Add delta months (subtract if delta < 0) to a given date.
    """
    m, y = (date.month + delta) % 12, date.year + ((date.month) + delta - 1) // 12
    if not m:
        m = 12
    d = min(date.day, monthrange(y, m)[1])
    return date.replace(day=d, month=m, year=y)


def get_formatted_dt_from_str(date_time: str, init_format: str, dt_format: str) -> str:
    dt = datetime.strptime(date_time, init_format)
    formatted_time = datetime.strftime(dt, dt_format)
    return formatted_time


def get_last_line_csv(csv_file: Any) -> Any:
    dict_from_csv = csv.DictReader(csv_file)
    list_data = list(dict_from_csv)
    lastline = list_data[-1]
    return lastline


def get_multiplier_by_unit(unit: Optional[str] = None) -> float:
    """Given a point, return a multiplier to calculate history total."""
    if unit == "W":
        multiplier = WATT_MULTIPLIER
    elif unit == "kW":
        multiplier = KWATT_MULTIPLIER
    else:
        logger.error(
            "Trying to calculate history for point which has units other than W/kW."
        )
        multiplier = OTHER_MULTIPLIER
    return multiplier


def add_environment_tag_to_datadog(function: Callable):  # type: ignore
    @wraps(function)
    def wrapper(*args, **kwargs):  # type: ignore
        import app

        kwargs["environment"] = app.get_env()
        function(*args, **kwargs)

    return wrapper


def get_building_from_point(point_id: int) -> Optional[int]:
    try:
        point = Point.get_point_by_id(point_id=point_id)
        building = point.device.building
        return int(building.id)
    except Exception:
        return None


def building_associated_with_user(building_id: int) -> bool:
    user_building = [
        True for building in current_user.buildings if building.id == building_id
    ]
    company_building = None
    if current_user.company:
        company_building = [
            True
            for building in current_user.company.buildings
            if building.id == building_id
        ]
    if user_building or company_building:
        return True
    else:
        return False


def get_display_month(month: str) -> Optional[str]:
    display_month = MONTH_DISPLAY.get(month)  # type: Optional[str]
    return display_month


def get_event_scheduler_order(status: Optional[str] = NEXT) -> int:
    if status == IN_ACTION:
        return 1
    if status == NEXT:
        return 2
    if status == COMPLETE:
        return 3
    return 4


ZIPCODE_TO_LAT_LON = {"08054": ("39.949", "-74.903"), "423800": ("55.6833", "52.3167")}


def get_lat_lon(zipcode: str) -> Tuple[str, str]:
    return ZIPCODE_TO_LAT_LON[zipcode]


def get_fe_strtime_to_datetime(fe_str_time: str) -> datetime:
    return datetime.strptime(fe_str_time, constants.FE_DATETIME_FORMAT)


def round_up_to_current_fifteen_minutes(time: datetime) -> datetime:
    """Roundoff minutes into current 15 minute cycle"""
    minutes = time.minute
    minute = 0
    for min in range(0, 61, constants.TIME_DIFFERENCE):
        if minutes >= min and minutes < min + constants.TIME_DIFFERENCE:
            minute = min
            break
    return time.replace(minute=minute, second=0, microsecond=0)


def get_billing_cycle_limits_in_utc(
    from_day: int = 1, month: int = 1, year: int = 2020
) -> Tuple[datetime, datetime]:
    """Given a month, return start and end dates for a billing cycle

    that starts during this month."""

    est = pytz.timezone("US/Eastern")
    start_day = min(from_day, monthrange(year, month)[1])
    start_date = datetime(year, month, start_day, 0)
    # convert EST zero time into UTC
    start_date = est.localize(start_date).astimezone(pytz.utc)

    next_month = month + 1
    next_year = year
    if next_month == 13:
        next_month = 1
        next_year = year + 1
    end_day = min(from_day, monthrange(next_year, next_month)[1])
    end_date = datetime(next_year, next_month, end_day, 0) - timedelta(days=1)
    # convert EST zero time into UTC
    end_date = est.localize(end_date).astimezone(pytz.utc)
    return start_date, end_date


def last_read_ts_in_db(point_id: int) -> Optional[datetime]:
    with DBConnection() as conn:
        sql = """select max(hist.ts) as max_ts
            from history hist
            where hist.point_id = %s
            """
        recs = conn.select_dict(sql, [point_id])
        if recs and isinstance(recs[0]["max_ts"], datetime):
            return recs[0]["max_ts"]
    return None


# Get Billing Peak value for the building for the local(non UTC) time
def get_billing_peak(building_id: int, lcl_time: datetime) -> Optional[float]:
    with DBConnection() as conn:
        sql = """select peak_value
            from billing_peak
            where building_id = %s
            and from_time <= %s
            and to_time >= %s
            order by to_time desc
            """
        recs = conn.select_dict(sql, [building_id, lcl_time, lcl_time])
        if recs:
            return float(recs[0]["peak_value"])

    return None


def get_current_billing_cycle_start_time_utc(billing_cycle_from_day):
    zero_hr_today = pytz.utc.localize(get_zero_hour_time())
    billing_cycle_start_day = None
    if zero_hr_today.day < billing_cycle_from_day:
        # Billing cycle started last month, determine previous month
        first_of_month = zero_hr_today.replace(day=1)
        last_day_previous_month = first_of_month - timedelta(days=1)
        billing_cycle_start_day = last_day_previous_month.replace(
            day=billing_cycle_from_day
        )

    else:
        # Billing cycle started in the current month
        billing_cycle_start_day = zero_hr_today.replace(day=billing_cycle_from_day)

    return billing_cycle_start_day.astimezone(pytz.utc)


def send_email(from_email, to_emails, subject, body, cc_email=[]):
    message = Mail(from_email=from_email,
                   to_emails=to_emails,
                   subject=subject,
                   html_content=body)
    if cc_email:
        cc_email = list(map(Cc, cc_email))
        message.add_cc(cc_email)
    
    try:
        sendgrid_api_key = SecretsManager.get_instance().get_secret(SecretName.SendGridAPIKey)
        sg = SendGridAPIClient(sendgrid_api_key["api_key"])
        response = sg.send(message)
        
    except Exception as exc:
        logger.error("Error while sending email.", exc)
        slack.send_alert("Error while sending email: {}".format(traceback.format_exc()))


if __name__ == "__main__":
    from_email = "support@davidenergy.com"  # register email with sendgrid
    to_email = ["amit@davidenergy.com"]
    subject = "test"
    body = '<strong>My HTML Email and easy to do anywhere, even with Python</strong>'
    send(from_email, to_email, subject, body)