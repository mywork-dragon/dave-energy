from config import logger
from common.constants import COMPLETE, IN_ACTION, NEXT, MONTH_DISPLAY
from datetime import datetime
import pytz
from typing import Any, List, Optional, Dict

from hszinc.datatypes import BasicQuantity

from common.exceptions import ResourceNotFound
from models.building import Building
from models.dispatch import Dispatch
from models.user import User
from models.energy_star import EnergyStar
from services.niagara4_service import get_site


def get_site_building(building_name: str) -> Any:
    return get_site(building_name)


def sync_building_data(building_name: str) -> Optional[Building]:
    """
    Return Building object if present in DB or Niagara else None

    Parameters:
    building_name (String): Building Name in DB or Entity Id in Niagara.

    Returns:
    Building Object or None: based on building_name passed
    """
    building_ref = None
    try:
        building_ref = Building.get_building_by_name(building_name)
        if not building_ref:
            building = get_site_building(building_name)
            building_data = dict(
                name=building_name,
                address=_get_n4_building_address(
                    building_name, building.tags.get("geoAddr")
                ),
                sq_footage=_get_n4_building_area(building.tags.get("area")),
            )
            building_ref = Building.create_building(**building_data)
    except Exception as error:
        logger.error(f"Sync Building Failed for - {building_name}", error)

    return building_ref


def _get_n4_building_address(building_name: str, address: str) -> str:
    # TODO: Add logic to split ID and return name
    return building_name if (address == "" or address == None) else address


def _get_n4_building_area(area: Any) -> Any:
    return area.value if isinstance(area, BasicQuantity) else area


def get_event_scheduler_status(start_date: datetime, end_date: datetime) -> str:
    current_time = pytz.utc.localize(datetime.utcnow())
    if not start_date.tzinfo:
        start_date = pytz.utc.localize(start_date)
    if not end_date.tzinfo:
        end_date = pytz.utc.localize(end_date)
    if current_time >= start_date:
        if current_time >= end_date:
            return COMPLETE
        return IN_ACTION
    return NEXT


def get_building_energy_ratings(building_id: int, year: int) -> List[Dict[Any, Any]]:
    building_energy_stars = []  # type: List[Dict[Any, Any]]
    energy_stars = EnergyStar.get_building_energy_star(
        building_id=building_id, year=year
    )

    for month_str, month_display in MONTH_DISPLAY.items():
        month = int(month_str)
        energy_star = energy_stars.filter_by(month=month, year=year).one_or_none()
        energy_star_score = change = 0
        if energy_star:
            energy_star_score = energy_star.score

        if month > 1:
            previous_energy_star = energy_stars.filter_by(
                month=month - 1, year=year
            ).one_or_none()
            if previous_energy_star:
                change = energy_star_score - previous_energy_star.score

        building_energy_stars.append(
            {
                "month_display": month_display,
                "month": month,
                "value": energy_star_score,
                "change": change,
            }
        )
    return building_energy_stars
