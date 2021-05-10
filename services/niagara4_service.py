import hszinc
from hszinc.datatypes import BasicQuantity
import json
from pyhaystack.client.niagara import Niagara4HaystackSession
from typing import Any, Dict, List

from config import logger
from config import current_config as config

from common.constants import N4_TIMEOUT, REDIS_EXPIRE
from data.cache.redis_cache import RedisCache  # type: ignore
from models.point import Point


session = Niagara4HaystackSession(
    uri=config.NIAGARA4_SERVER,
    username=config.NIAGARA4_USERNAME,
    password=config.NIAGARA4_PASSWORD,
    http_args=dict(tls_verify=False, debug=True),
    pint=False,
)
session._grid_format = hszinc.MODE_ZINC


rcache = RedisCache.get_instance()


def get_site(site_name: str) -> Any:
    """
    return a site by name
    site_name example: S.~31430Broadway.elecMeter
    """
    op = session.get_entity(site_name, refresh=True)
    op.wait()
    site = op.result
    return site


def get_site_data(entity_name: str, refresh: bool = False) -> Dict[Any, Any]:
    """
    Return current value and type of entity.
    Throws error if correct site name is not passed.
    """
    if refresh:
        cached = None
    else:
        cached = rcache.get(entity_name)

    if cached:
        # got value from cache
        ret = json.loads(cached)  # type: Dict[str, Any]
        return ret
    else:
        # no value in cache or skipped cache, get value from N4
        entity = get_site(entity_name)
        data = dict(value=entity.tags.get("curVal"), type=entity.tags.get("kind"),)
        if isinstance(data["value"], BasicQuantity):
            data["value"] = data["value"].value
        stored_val = json.dumps(data)
        rcache.set(entity_name, stored_val)
        rcache.expire(entity_name, REDIS_EXPIRE)

        return data


def invoke_action(entity: str, val: Any) -> Any:
    """
    Perform session invoke action operation on entity and return Grid
    Throws error if correct entity or value is not passed.
    """

    resp = session.invoke_action(entity, "set", val=val)
    result = hszinc.dump(resp.result, hszinc.MODE_JSON)
    # update_point_val_and_kind(entity)
    return result


def change_mode(entity: str, val: Any) -> Any:
    """
    sets the value for a given entity and returns the result.
    Throws error if correct entity or value is not passed.
    """
    updated_data = invoke_action(entity, val)
    return updated_data


def get_all_sites() -> Any:
    """
    returns all the sites we have
    """
    return session.sites


def get_history_for_device(
    device_name: str, rng: str = "today"
) -> List[Dict[Any, Any]]:
    """
    example device: 'S.~3575Madison.elecMeter.currentBuilding_Demand'
    """
    op = session.his_read(device_name, rng=rng)
    op.wait()
    site = op.result
    formatted_data = _format_data(site)
    return formatted_data


def get_history_for_point(point_path: str, rng: str = "today") -> List[Dict[Any, Any]]:
    """
    example device: 'S.~3575Madison.elecMeter.currentBuilding_Demand'
    """
    logger.info(f"update_niagara4_device_history - calling N4 for {point_path}")
    op = session.his_read(point_path, rng=rng)
    proper_return = op.wait(timeout=N4_TIMEOUT)
    logger.info(f"update_niagara4_device_history - done calling N4 for {point_path}")
    site = op.result
    formatted_data = _format_data(site)
    return formatted_data


def _format_data(site: Any) -> List[Dict[Any, Any]]:
    formatted_data = []
    point_name = site.metadata["id"].name
    point = Point.get_point_by_path(point_name)
    for row in site._row:
        if point:
            formatted_data.append(
                dict(point_id=point.id, ts=row["ts"], quantity=row["val"].value,)
            )
        else:
            logger.error(f"couldn't find point by name {point_name}")
    return formatted_data


def fetch_points_from_n4() -> List[Point]:
    """
    Return all the points fetched from niagara4 API
    """
    try:
        points = session.find_entity("point")
        point_results = points.result
        point_values = list(point_results.values())
        return point_values
    except Exception as error:
        logger.error("Unable to fetch points form Niagara.", error)
        return list()
