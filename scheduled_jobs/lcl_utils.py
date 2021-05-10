from pyhaystack.client.niagara import Niagara4HaystackSession

from config import logger
from data.db_connection import DBConnection

from typing import List, Dict


def get_n4_connection(building_id: int) -> Niagara4HaystackSession:
    with DBConnection() as conn:
        sql = """select ip_address, port, username, password
            from n4_credential
            where building_id = %s
            """
        recs = conn.select_dict(sql, [building_id])
        if not recs:
            raise Exception(
                "N4 credentials not found for building: {}".format(building_id)
            )

        url = "https://{}:{}".format(recs[0]["ip_address"], recs[0]["port"])
        return Niagara4HaystackSession(
            uri=url,
            username=recs[0]["username"],
            password=recs[0]["password"],
            http_args=dict(tls_verify=False, debug=True),
            pint=False,
        )
        logger.info(
            "Established connection with N4 for building: {}".format(building_id)
        )


def get_active_buildings() -> List[Dict[str, str]]:
    buildings = []
    with DBConnection() as conn:
        sql = """select bld.id as building_id, bld.name as building_name, comp.name as company_name
                from building bld
                    INNER JOIN company comp ON bld.company_id = comp.id
                where comp.status = 1
                and bld.status = 1
                """
        for rec in conn.select_dict(sql):
            building = {}
            building["building_id"] = rec["building_id"]
            building["building_name"] = rec["building_name"]
            building["company_name"] = rec["company_name"]
            buildings.append(building)

    return buildings


def get_building_details(building_id: int):
    with DBConnection() as conn:
        sql = "select name from building where id = %s"
        recs = conn.select_dict(sql, [building_id])
        if recs:
            return {
                "building_name": recs[0]["name"]
            }

    return None