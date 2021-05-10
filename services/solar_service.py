from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from models.history import History
from models.asset import Asset
from config import logger
from third_party.solar_edge.solar_constants import (
    SOLAR_DEVICE,
    POWER_ENDPOINT,
    ENERGY_ENDPOINT,
    INVENTORY_ENDPOINT,
    EQUIPMENT_ENDPOINT,
    INVERTER_EQUIPMENT,
    INVERTER_POINT_NAMES,
    DATETIME_FORMAT,
    DATE_FORMAT,
)
from third_party.solar_edge.client import client_session
from common.utils import time_to_utc, time_to_est
from services.point_service import point_ids_filtered


def power(
    asset_id: str,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
) -> List[Dict[Any, Any]]:
    """
    Communicates with SolarEdge Power Endpoint and Parses data to specified format
        Args--
            building_name: Pass in the name of the building. ex: "S.~3000Atrium"
        Returns--
            Parsed data for power endpoint according to database schema
    """
    now = datetime.utcnow()
    asset = Asset.get_asset_by_id(int(asset_id))
    point_list = asset.points
    point_id = point_ids_filtered(point_list, POWER_ENDPOINT)
    if not point_id:
        return []

    # TODO: Handle Timezones with asset in different timezones
    # time is converted to est to match the asset local time
    if end_time and start_time:
        end = time_to_est(end_time.strftime(DATETIME_FORMAT), DATETIME_FORMAT)
        start = time_to_est(start_time.strftime(DATETIME_FORMAT), DATETIME_FORMAT)
    else:
        end = time_to_est(now.strftime(DATETIME_FORMAT), DATETIME_FORMAT)
        start = time_to_est(
            (now - timedelta(minutes=90)).strftime(DATETIME_FORMAT),
            DATETIME_FORMAT,
        )

    ts_data = []
    try:
        json_obj = client_session.solar_edge(
            POWER_ENDPOINT, startTime=start, endTime=end
        )
        values = json_obj["data"]["power"]["values"]

        for value in values:
            # time is converted back to UTC to ensure that database time is consistent
            ts = time_to_utc(str(value["date"]), DATETIME_FORMAT)
            quantity = value["value"]
            if quantity == None:
                pass
            else:
                ts_data.append(
                    {"point_id": point_id, "ts": ts, "quantity": float(quantity)}
                )
    except Exception as error:
        logger.error(f"Error getting solaredge power data for {asset}", error)

    return ts_data


def energy(
    asset_id: str, start: Optional[datetime] = None, end: Optional[datetime] = None
) -> List[Dict[Any, Any]]:
    """
    Communicates with SolarEdge Energy Endpoint and Parses data to specified format
        Args--
            building_name: Pass in the name of the building. ex: "S.~3000Atrium"
        Returns--
            Parsed data for Energy endpoint according to database schema
    """
    now = datetime.utcnow()
    # TODO: Handle Timezones with asset in different timezones
    # time is converted to est to match the asset local time

    if start and end:
        start_day = time_to_est(start.strftime(DATE_FORMAT), DATE_FORMAT)
        end_day = time_to_est(end.strftime(DATE_FORMAT), DATE_FORMAT)
    else:
        start_day = end_day = time_to_est(now.strftime(DATE_FORMAT), DATE_FORMAT)

    period = "QUARTER_OF_AN_HOUR"
    asset = Asset.get_asset_by_id(int(asset_id))
    point_list = asset.points

    point_id = point_ids_filtered(point_list, ENERGY_ENDPOINT)
    if not point_id:
        return []

    ts_data = []
    try:
        json_obj = client_session.solar_edge(
            ENERGY_ENDPOINT, startDate=start_day, endDate=end_day, timeUnit=period
        )
        values = json_obj["data"]["energy"]["values"]

        for value in values:
            # time is converted back to UTC to ensure that database time is consistent
            ts = time_to_utc(value["date"], DATETIME_FORMAT)
            quantity = value["value"]
            if quantity == None:
                pass
            else:
                ts_data.append(
                    {"point_id": point_id, "ts": ts, "quantity": float(quantity)}
                )
    except Exception as error:
        logger.error(f"Error getting solaredge energy data for {asset}", error)

    return ts_data


def create_history_for_solar_power(
    asset_id: str, start: Optional[datetime] = None, end: Optional[datetime] = None
) -> List[History]:
    data = power(asset_id, start, end)
    power_history = History.create_asset_history(data)
    return power_history


def create_history_for_solar_energy(
    asset_id: str, start: Optional[datetime] = None, end: Optional[datetime] = None
) -> List[History]:
    data = energy(asset_id, start, end)
    energy_history = History.create_asset_history(data)
    return energy_history
