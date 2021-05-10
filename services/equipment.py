from typing import List, Dict, Any
from models.device import Device


def get_building_equipments_by_asset_types(
    building_id: int, asset_type: str
) -> List[Dict[Any, Any]]:
    building_equipments = []
    equipments = Device.get_building_devices_by_asset_type(
        building_id=building_id, asset_type=asset_type
    )
    for equipment in equipments:
        points = []
        for point in equipment.points:
            points.append({"id": point.id, "name": point.name})
        building_equipments.append({"name": equipment.name, "points": points})
    return building_equipments
