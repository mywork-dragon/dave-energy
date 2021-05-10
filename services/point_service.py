from collections import defaultdict
from datetime import datetime
import typing
from typing import Any, Dict, List, Optional, Tuple

from config import logger
from common.constants import AssetTypes, DATETIME_FORMAT, FE_DATETIME_FORMAT
from common.exceptions import ResourceNotFound
from common.utils import get_multiplier_by_unit, time_to_est
from models.asset import Asset
from models.asset_type import AssetType
from models.history import History
from models.point import Point, PointTag
from models.dispatch import Dispatch, DispatchStatus
from hszinc.datatypes import BasicQuantity


def point_ids_filtered(
    point_list: List[Any],
    point_type: str,
) -> Optional[Any]:
    point_id = None
    for point in point_list:
        if point_type.lower() in point.path.lower():
            point_id = point.id
    return point_id


def create_n4_point(point: Point, asset: Asset) -> Optional[Point]:
    new_point = None
    try:
        point_dict = dict(
            path=point._entity_id,
            unit=point.tags.get("unit"),
            point_type=point.tags.get("kind"),
            asset=asset,
        )

        new_point = Point.create_point(**point_dict)
        logger.info(f"New point created with Id {new_point.id}")
    except Exception as error:
        logger.error("Error in creating Point", error)
    return new_point


def _get_device_name(point_name: str, point_nav: str) -> str:
    """
    Check current point format and extract device_name

    Return asset name
    """
    # TODO: Check different formats of point names
    device_name = point_name.split(f".{point_nav}")[0]
    return device_name


def get_sync_asset(asset_name: str) -> Optional[Asset]:
    from services.device_service import sync_asset_data

    return sync_asset_data(asset_name)


def _point_valid(point_name: str) -> bool:
    """
    Checks if point is valid for further process.
    """
    ignore_list = ["Settings", "General", "EcoGenesis_SmartGrid", "Drivers", "Analysis"]
    return not any(name in point_name for name in ignore_list)


@typing.no_type_check
def get_point_data(point: Point, refresh=False) -> Dict[Any, Any]:
    from services.niagara4_service import get_site_data

    if not point:
        raise ResourceNotFound("point not found")

    try:
        return get_site_data(point.path, refresh)
    except Exception as error:
        logger.error(f"couldn't get point id: {point.id} data from N4. Error: {error}")
        return dict(value=0)


@typing.no_type_check
def get_target_reduction_value(building_id: int) -> Dict[Any, Any]:
    target_reduction_point = Point.get_point_by_tag(
        building_id=building_id, tag="TARGET_REDUCTION"
    )
    if not target_reduction_point:
        return dict(value=0)

    return get_point_data(target_reduction_point)


@typing.no_type_check
def get_real_time_reduction_value(building_id: int) -> Dict[Any, Any]:
    real_time_reduction_point = Point.get_point_by_tag(
        building_id=building_id, tag="REAL_TIME_REDUCTION"
    )
    if not real_time_reduction_point:
        return dict(value=0)

    return get_point_data(real_time_reduction_point)


def round_pt_data(pt_data: Dict[Any, Any]) -> Dict[Any, Any]:
    if not pt_data or not pt_data.get("value"):
        return pt_data
    pt_data["value"] = round(pt_data["value"])
    return pt_data


def get_setting_point_values(
    building_id: int, dispatch_event: Dispatch
) -> List[Dict[Any, Any]]:
    setting_points_list = []
    default_set_points = Point.get_points_by_tag(
        building_id=building_id, tag=PointTag.DEFAULT_SETPOINT.value
    )
    event_set_points = Point.get_points_by_tag(
        building_id=building_id, tag=PointTag.EVENT_SETPOINT.value
    )
    override_set_points = Point.get_points_by_tag(
        building_id=building_id, tag=PointTag.OVERRIDE_SETPOINT.value
    )

    default_set_points_dict = {p.name: p for p in default_set_points}
    override_set_points_dict = {p.name: p for p in override_set_points}

    for event_point in event_set_points:
        default_point = default_set_points_dict.get(event_point.name)
        if not default_point:
            continue
        override_point = override_set_points_dict.get(event_point.name)

        default_data = round_pt_data(get_point_data(default_point))
        event_data = round_pt_data(get_point_data(event_point))

        point_id = None
        if override_point and dispatch_event.status == DispatchStatus.IN_PROGRESS.value:
            override_data = get_point_data(override_point, True)
            if override_data["value"] == 0 or override_data["value"] == False:
                point_id = override_point.id

        res = dict(
            point_name=event_point.name,
            point_id=point_id,
            default_set_point=dict(
                value=default_data["value"], unit=default_point.unit
            ),
            event_set_point=dict(value=event_data["value"], unit=event_point.unit),
        )
        setting_points_list.append(res)

    return setting_points_list