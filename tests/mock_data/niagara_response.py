import hszinc
from types import SimpleNamespace


def get_invoke_action_data():  # type: ignore
    grid_data = hszinc.Grid(version="3.0")
    grid_data.column["empty"] = {}
    data = hszinc.dump(grid_data, hszinc.MODE_JSON)
    return data


def get_entity_data():  # type: ignore
    data = dict(curVal=True, kind="Bool")
    res = dict(tags=data)
    return SimpleNamespace(**res)


def get_site_building_data():  # type: ignore
    data = dict(geoAddr="20 Test Street", area=1200)
    res = dict(tags=data)
    return SimpleNamespace(**res)


def get_site_device_data():  # type: ignore
    data = dict(navName="ElecMeter.MainKW")
    res = dict(tags=data)
    return SimpleNamespace(**res)


def n4_point_data():  # type: ignore
    data = dict(curVal=True, kind="Bool")
    res = dict(tags=data, _entity_id="S.~2020TestSt.ElecMeter.MainKW.EM_Demand")
    return SimpleNamespace(**res)


def get_points_data_from_n4():  # type:ignore
    point1 = SimpleNamespace(
        **dict(
            tags=dict(curVal=True, kind="Bool"),
            _entity_id="S.~2020TestSt.ElecMeter.MainKW.EM_Demand",
        )
    )
    point2 = SimpleNamespace(**dict(tags=dict(curVal=True, kind="Bool")))
    point3 = SimpleNamespace(
        **dict(
            tags=dict(curVal=True, kind="Bool"),
            _entity_id="S.~2020TestSt2.ElecMeter.MainKW.EM_Demand",
        )
    )
    point4 = SimpleNamespace(
        **dict(
            tags=dict(curVal=True, kind="Bool"),
            _entity_id="S.~2020TestSt3.ElecMeter.MainKW.EM_Demand",
        )
    )
    point5 = SimpleNamespace(
        **dict(
            tags=dict(curVal="Fail", kind="String"),
            _entity_id="S.~2020TestSt4.ElecMeter.MainKW.EM_Demand",
        )
    )
    return [point1, point2, point3, point4, point5]
