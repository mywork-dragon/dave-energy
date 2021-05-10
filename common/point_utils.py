

from typing import Any, Dict, List

from common.constants import EnergyTypes
from data.db_connection import DBConnection


def get_asset_points(building_id: int,
                     asset_type_name: str,
                     asset_energy_type: EnergyTypes = EnergyTypes.Electric,
                     **kwargs) -> Dict[str, Any]:
    points = []
    with DBConnection() as conn:
        args = [building_id, asset_energy_type.value, asset_type_name]
        if "unit_id" in kwargs:
            sql = get_sql_filter_by_unit()
            args.append(kwargs["unit_id"])
        elif "tag" in kwargs:
            sql = get_sql_filter_by_tag()
            args.append(kwargs["tag"])

        recs = conn.select_dict(sql, args)
        for rec in recs:
            points.append({
                "point_id": rec["id"],
                "point_path": rec["path"],
                "unit_symbol": rec["symbol"],
            })

    return points


def get_sql_filter_by_unit():
    return """select pt.id, pt.path, ut.symbol
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
                INNER JOIN point pt ON ast.id = pt.asset_id
                INNER JOIN unit ut ON pt.unit_id = ut.id
            where ast.building_id = %s
            and ast.energy_type = %s
            and at.name = %s
            and ut.id = %s
            """

def get_sql_filter_by_tag():
    return """select pt.id, pt.path, ut.symbol
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
                INNER JOIN point pt ON ast.id = pt.asset_id
                INNER JOIN unit ut ON pt.unit_id = ut.id
            where ast.building_id = %s
            and ast.energy_type = %s
            and at.name = %s
            and pt.tag = %s
            """