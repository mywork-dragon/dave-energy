from tests.factories import BuildingFactory, DeviceFactory, PointFactory
from typing import Optional, Any


building_name = "S.~3Test"


def _get_test_device() -> Optional[Any]:
    building = BuildingFactory(name=building_name, address="test")
    solaredge_device = DeviceFactory(
        name=f"{building_name}.SolarEdge", building=building
    )
    heatwatch_device = DeviceFactory(
        name=f"{building_name}Heatwatch", building=building
    )
    return building


def _get_test_point() -> Optional[Any]:
    building = BuildingFactory(name=building_name, address="test")

    solaredge_device = DeviceFactory(
        name=f"{building_name}.SolarEdge", building=building
    )
    heatwatch_device = DeviceFactory(
        name=f"{building_name}Heatwatch", building=building
    )
    test_power_point = PointFactory(
        path=f"{building_name}.SolarEdge.power", device=solaredge_device
    )
    test_energy_point = PointFactory(
        path=f"{building_name}.SolarEdge.energy", device=solaredge_device,
    )
    test_status_point = PointFactory(
        path=f"{building_name}.Heatwatch.status", device=heatwatch_device,
    )

    return building
