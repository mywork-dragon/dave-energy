from calendar import month_abbr, monthrange
from datetime import date, datetime, time, timedelta
import pytz
from typing import Any, Dict, Optional, Tuple, List

from config import logger
from common.constants import (
    AssetTypes,
    FE_DATETIME_FORMAT,
    FE_DATETIME_FORMAT2,
    GHG_EMISSIONS_PER_KWH,
)
from common.exceptions import ResourceNotFound
from common.utils import (
    get_multiplier_by_unit,
    get_zero_hour_time,
    est_to_utc_datetime,
    month_delta,
    time_to_est,
)
from models.billing_cycle import BillingCycle
from models.billing_peak import BillingPeak
from models.building import Building
from models.asset import Asset
from models.asset_type import AssetType
from models.history import History
from models.point import Point
from models.unit import Unit
from common import constants, utils
from services.equipment import get_building_equipments_by_asset_types
from controller.control_room import billing_data
from controller.analytics_building_engineer.consumption_details import ConsumptionDetails

EST_TZ = pytz.timezone("America/New_York")


def get_billing_cycle(
    building_id: int, from_time: Optional[str] = None
) -> Dict[str, Any]:
    if from_time:
        try:
            start_date = datetime.strptime(from_time, FE_DATETIME_FORMAT).date()
        except ValueError:
            start_date = datetime.strptime(from_time, FE_DATETIME_FORMAT2).date()
    else:
        start_date = date.today()

    latest_bc = BillingCycle.get_latest_billing_cycle(building_id)
    if latest_bc:
        from_day = latest_bc.from_day
        from_dt, to_dt = get_current_billing_cycle_limits(start_date, from_day)
        billing_cycle_info = {
            "from_date": from_dt.strftime("%b %-d").upper(),
            "to_date": to_dt.strftime("%b %-d").upper(),
            "days_left": (start_date - to_dt).days,
        }
    else:
        raise ResourceNotFound("Latest billing cycle not found.")
    return billing_cycle_info


def get_from_dt(from_date: date, from_day: int) -> date:
    """
    Get first day of the billing cycle starting on a from_day,

    for a given from_date.
    """
    month = from_date.month
    year = from_date.year
    start_day = min(from_day, monthrange(year, month)[1])
    return from_date.replace(day=start_day)


def get_current_billing_cycle_limits(
    start_date: date, from_day: int
) -> Tuple[date, date]:
    if start_date.day < from_day:
        # we're in a billing cycle that started last month
        from_dt = month_delta(start_date, -1)
    else:
        # we're in a billing cycle that started this month
        from_dt = start_date

    from_dt = get_from_dt(from_dt, from_day)

    # If from_day == 31, then 31 Jan/28 Feb, or 28 Feb/31 Mar are special cases.
    # Get the first day of the _next_ period; one day before that would be
    # the end of this period.
    next_from_dt = get_from_dt(month_delta(from_dt, 1), from_day)
    to_dt = next_from_dt - timedelta(days=1)
    if to_dt < start_date:
        # If from_day == 31 and we're in 28 February, from_dt would be 28 Feb,
        # and to_dt would be March 30
        next2_from_dt = get_from_dt(month_delta(from_dt, 2), from_day)
        from_dt = next_from_dt
        to_dt = next2_from_dt - timedelta(days=1)

    return from_dt, to_dt


def get_billing_cycle_start_day(building: Building) -> datetime:
    billing_cycle_date = get_current_billing_cycle_limits(
        datetime.today(), building.billing_cycles[-1].from_day
    )[0]
    # we need to use Eastern time midnight as BillingCycle start, but we work
    # with UTC internally, so convert that to UTC
    est = pytz.timezone("US/Eastern")
    est_bc_start = est.localize(
        datetime.combine(billing_cycle_date, datetime.min.time())
    )
    return est_bc_start.astimezone(pytz.utc)


def get_billing_information(building: Building) -> Dict[Any, Any]:
    billing_cycle_day = get_billing_cycle_start_day(building)
    today = pytz.utc.localize(get_zero_hour_time())
    now = pytz.utc.localize(datetime.utcnow())

    cycle_meter_data = billing_data.get_billing_cycle_meter_values(building.id, billing_cycle_day, now)
    day_meter_data = billing_data.get_billing_cycle_meter_values(building.id, today, now)
    target = utils.get_billing_peak(building.id, datetime.now())
    
    total_billing = (sum([m["quantity"] for m in cycle_meter_data]) / 4)
    day_billing = (sum([m["quantity"] for m in day_meter_data]) / 4)
    
    billing_peak = _get_billing_peak_information(data_points=cycle_meter_data, target=target)
    # Numerator on UI
    billing_peak["quantity"] = int(round(billing_peak["quantity"]))
    # Denominator on UI
    billing_peak["target"] = None
    if target:
        billing_peak["target"] = int(round(target))

    # TODO: Should be converted to timezone of the building
    billing_peak["ts"].astimezone(EST_TZ).strftime(FE_DATETIME_FORMAT)
    billing_cycle = get_billing_cycle(building.id)

    return dict(
        billing_total=int(round(total_billing)),
        billing_day_total=int(round(day_billing)),
        billing_peak=billing_peak,
        billing_cycle=billing_cycle,
    )


def _get_billing_peak_information(
    data_points: List[Dict[Any, Any]], target: Optional[float]
) -> Dict[Any, Any]:
    if data_points:
        billing_peak = max(data_points, key=lambda m: m["quantity"])
    else:
        # TODO: now should in buildind's timezone
        billing_peak = {
            "quantity": 0,
            "ts": datetime.now(),
        }

    billing_peak["quantity"] = int(round(billing_peak["quantity"]))
    billing_peak["target"] = None
    if target:
        billing_peak["target"] = int(round(target))

    billing_peak["targeted"] = int(
        round(_calculate_targeted(billing_peak["quantity"], billing_peak["target"]))
    )

    return billing_peak


def _calculate_targeted(peak: float, target: float) -> float:
    if not target:
        return 0
    return round((peak - target) / target * 100, 0)


def get_building_peak_target(
    building: Building, from_time: datetime, to_time: Optional[datetime] = None
) -> float:
    if to_time is None:
        to_time = from_time + timedelta(days=1)
    try:
        billing_peak = _get_building_peak_target_for_dates(
            building=building, from_time=from_time, to_time=to_time
        )
    except ResourceNotFound as error:
        logger.error(error.message)
        return 0

    return billing_peak


def _get_building_peak_target_for_dates(
    building: Building, from_time: datetime, to_time: datetime
) -> float:
    billing_peaks = BillingPeak.get_billing_peaks(
        building_id=building.id, from_time=from_time, to_time=to_time
    )
    if not billing_peaks:
        raise ResourceNotFound(f"did not find peak for building: {building.id}")

    peak_value = billing_peaks[0].peak_value  # type: float
    if not peak_value:
        raise ResourceNotFound(f"did not find peak for building: {building.id}")

    return peak_value


def get_billing_cycle_limits(
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


def get_greenhouse_gas_emissions(building: Building, year: int) -> List[Dict[str, Any]]:
    year_data = ConsumptionDetails().get_energy_consumption_by_month(building, year)
    for month_data in year_data:
        month_number = month_data["month_number"]
        month_data["quantity"] *= GHG_EMISSIONS_PER_KWH
        month_data["month_display"] = month_abbr[month_number]
        month_data["unit"] = "tCO2e"

        if month_number == 1:
            # TODO take previous year's December
            month_data["percentage"] = 0
        else:
            # NB month_number is 1-based
            previous_qty = year_data[month_number - 2]["quantity"]
            if previous_qty == 0:
                month_data["percentage"] = 0
            else:
                month_data["percentage"] = round(
                    (month_data["quantity"] - previous_qty) / previous_qty * 100, 1
                )
    return year_data