import pytz
import typing
from datetime import datetime, timedelta
from typing import Any, AnyStr, Dict, List, Optional, Tuple

from config import logger
from common.constants import FE_DATETIME_FORMAT, TIME_DIFFERENCE
from common.exceptions import ResourceNotFound
from models.building import Building
from models.asset import Asset, ThirdParties
from models.asset_type import AssetType
from models.point import Point
from models.history import History
from models.unit import Unit

from services.niagara4_service import (
    get_history_for_device,
    get_history_for_point,
    get_site,
)
from services.building_service import sync_building_data
from services.solar_service import (
    create_history_for_solar_energy,
    create_history_for_solar_power,
)

"""
example: This is how you would get the data for devices from date to date:
from_date = datetime(2020,3,1)
to_date = datetime.now()
update_devices_from_to(from_date=from_date,to_date=to_date)
"""


def get_asset_by_id(device_id: int) -> Asset:
    asset = Asset.get_asset_by_id(device_id)
    if not asset:
        raise ResourceNotFound("Asset not found")
    return asset


def get_assets_by_type(energy_type: str) -> List[Asset]:
    return Asset.get_assets_by_type(energy_type)


@typing.no_type_check
def get_devices_by_equip_type(building_name: str, device_type: str) -> List[Any]:
    building = Building.get_building_by_name(building_name)
    return [
        asset for asset in building.devices if device_type.lower() in asset.name.lower()
    ]


def create_history_for_device(asset: Asset, rng: Any = "today") -> List[History]:
    data = get_history_for_device(device_name=asset.name, rng=rng)
    device_history = History.create_asset_history(data)
    return device_history


def create_history_for_point(point: Point, rng: Any = "today") -> List[History]:
    logger.info(
        f"update_niagara4_device_history - getting history for pt {point.id}, {point.path}"
    )
    data = get_history_for_point(point_path=point.path, rng=rng)
    logger.info(
        f"update_niagara4_device_history - creating history for pt {point.id}, {point.path}"
    )
    point_history = History.create_asset_history(data)
    return point_history


def _range_variable(from_date: datetime, to_date: datetime) -> str:
    from_date_str = str(from_date.date())
    to_date_str = str(to_date.date())
    return f"{from_date_str},{to_date_str}"


def get_building_devices(building: Building) -> Any:
    """
    returns all the devices in building.
    """
    return building.devices


def get_distinct_utilities(building: Building) -> List[AnyStr]:
    """
    returns distinct utilities in a building
    """
    devices = get_building_devices(building)
    utilities_distinct = list(set([asset.energy_type for asset in devices]))
    return utilities_distinct


def _get_building_name(device_name: str, device_nav: str) -> str:
    """
    Check current asset format and extract building_name

    Return building name
    """
    # TODO: Check different formats of point names
    building_name = device_name.split(f".{device_nav}")[0]
    return building_name


def get_site_asset(asset_name: str) -> Any:
    return get_site(asset_name)


def get_sync_building(building_name: str) -> Optional[Building]:
    return sync_building_data(building_name)


def sync_asset_data(asset_name: str) -> Optional[Asset]:
    """
    Returns asset object if present in DB or niagara.
    """
    asset_ref = None
    try:
        asset_ref = Asset.get_asset_by_name(asset_name)
        if not asset_ref:
            asset_data = get_site_asset(asset_name)
            building_name = _get_building_name(asset_name, asset_data.tags["navName"])
            building_ref = get_sync_building(building_name)
            if building_ref:
                asset_data = dict(name=asset_name, building=building_ref)
                asset_ref = Asset.create_asset(**asset_data)
    except Exception as error:
        logger.error(f"Sync Asset Failed for - {asset_name}", error)

    return asset_ref


def _round_up_to_current_fifteen_minutes(time: datetime) -> datetime:
    """Roundoff minutes into current 15 minute cycle"""
    minutes = time.minute
    minute = 0
    for min in range(0, 61, TIME_DIFFERENCE):
        if minutes >= min and minutes < min + TIME_DIFFERENCE:
            minute = min
            break
    return time.replace(minute=minute, second=0, microsecond=0)


def get_energy_history(
    points: List[Point], from_time: datetime, to_time: datetime
) -> List[Any]:
    """
    get values on 15 min interval for main points (points we see on the graph)
    """
    points_dict = {}
    from_time = _round_up_to_current_fifteen_minutes(from_time)
    to_time = _round_up_to_current_fifteen_minutes(to_time)
    
    for point_obj in points:
        history_data = History.get_history(
            point_obj.id,
            from_time,
            to_time,
        )
        for history in history_data:
            if history.quantity:
                history_timestamp = _round_up_to_current_fifteen_minutes(history.ts)
                if history_timestamp in points_dict:
                    points_dict[history_timestamp] += history.quantity
                else:
                    points_dict[history_timestamp] = history.quantity

    points_history_list = [
        dict(ts=key, quantity=value)
        for key, value in points_dict.items()
    ]

    return points_history_list