from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List
import pytz

from common.utils import time_to_est, get_multiplier_by_unit
from common.constants import (
    AssetTypes,
    FE_DATETIME_FORMAT,
    ENERGY_TYPES,
    FE_DATETIME_FORMAT,
    OTHER_MULTIPLIER,
    WATT_MULTIPLIER,
)

from models.building import Building
from models.asset import Asset
from models.point import Point
from services.solar_service import (
    create_history_for_solar_energy,
    create_history_for_solar_power,
)
from common import utils, point_utils, history_utils
from config import logger
from controller.control_room import electric_charts

EST_TZ = pytz.timezone("America/New_York")


def get_energy_consumption_data(
    from_time: datetime,
    to_time: datetime,
    building_id: int,
    requested_energy_type: str,
) -> Dict[Any, Any]:

    energy_consumption_data = defaultdict(list)  # type: Dict[Any, Any]
    assets = Asset.query.filter_by(
        building_id=building_id, energy_type=requested_energy_type
    )

    asset_type_to_meter_data = {}
    asset_type_to_unit = {}
    for asset in assets:
        if not asset.asset_type.name in asset_type_to_meter_data:
            asset_type_to_meter_data[asset.asset_type.name] = {}
            # Set 0-23hrs, 0/15/30/45mins quantity to 0, this padding is needed for UI
            for hr in range(0, 24):
                for min in ['00', '15', '30', '45']:
                    key = "{:02d}:{}".format(hr, min)
                    asset_type_to_meter_data[asset.asset_type.name][key] = 0
        
        meter_point = Point.query.filter_by(asset_id=asset.id, tag='METER').first()
        if not meter_point:
            # Ignore assets with no METER point
            continue
        
        # TODO: Remove the duplication of code below for meter export point
        asset_type_to_unit[asset.asset_type.name] = meter_point.unit.symbol
        energy_history = history_utils.get_point_history(meter_point.id, from_time, to_time)
        for eh in energy_history:
            # TODO: Should be converted to timezone of the building
            ts = eh["ts"].astimezone(EST_TZ)
            ts = utils.round_up_to_current_fifteen_minutes(ts)
            ts = ts.strftime("%H:%M")

            quantity = round(eh["quantity"])
            if asset.asset_type.name == 'Solar':
                # This will make the bars appear below the x axis
                quantity = quantity * (-1)

            asset_type_to_meter_data[asset.asset_type.name][ts] += quantity

        meter_export_point = Point.query.filter_by(asset_id=asset.id, tag='METER_EXPORT').first()
        if meter_export_point:
            energy_history = history_utils.get_point_history(meter_export_point.id, from_time, to_time)
            for eh in energy_history:
                # TODO: Should be converted to timezone of the building
                ts = eh["ts"].astimezone(EST_TZ)
                ts = utils.round_up_to_current_fifteen_minutes(ts)
                ts = ts.strftime("%H:%M")

                quantity = round(eh["quantity"])
                if asset.asset_type.name == 'Solar':
                    # This will make the bars appear below the x axis
                    quantity = quantity * (-1)

                asset_type_to_meter_data[asset.asset_type.name][ts] -= quantity
    

    for asset_name, meter_data in asset_type_to_meter_data.items():
        if not asset_name in asset_type_to_unit:
            logger.info("Skipping, {}, does not have unit added.".format(asset_name))
            continue

        point_energy_data = defaultdict(dict)  # type: Dict[Any, Any]
        point_energy_data["name"] = asset_name
        point_energy_data["unit"] = asset_type_to_unit[asset_name]

        # Turn dictionary to list of dictionary
        total_meter_data = []
        for key, val in meter_data.items():
            total_meter_data.append({
                "ts": key,
                "quantity": val
            })
        point_energy_data["history_data"] = total_meter_data

        energy_consumption_data[ENERGY_TYPES[requested_energy_type]].append(
            point_energy_data
        )

    # Add 'other' data if type is electric
    if requested_energy_type == "electric":
        other = dict(
            name="Other", unit="kW",
            history_data=electric_charts.compute_other_chart_values(building_id, from_time, to_time),
            device_type="Electric"
        )
        energy_consumption_data[ENERGY_TYPES[requested_energy_type]].append(other)

    return energy_consumption_data