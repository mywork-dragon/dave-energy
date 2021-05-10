
from datetime import datetime, timedelta

from data.db_connection import DBConnection

# Meter point and no value read for more than 15 mins
# Meter point and not able to read from N4
# Setpoint and not able to read

def run():
    # Check if can read meter point from N4
    for building in get_active_buildings():
        meter_point_id, _, _ = _get_meter_point_id(building['building_id'])

        if meter_point_id and _has_n4_credentials(building['building_id']):
            # Check if can read from N4
            if _has_n4_credentials(building['building_id']):
                # Check if latest value in db is within 15 mins
                _15_mins_ago = datetime.utcnow() - timedelta(minutes=15)
                latest_value_ts = _get_latest_value_ts(meter_point_id)
                if latest_value_ts and latest_value_ts < _15_mins_ago:
                    print('{}, {} building meter value read is older than 15 mins ago: {}'.format(
                        building['company_name'], building['building_name'], latest_value_ts
                    ))


def get_active_buildings():
    buildings = []
    with DBConnection() as conn:
        sql = '''select bld.id as building_id, bld.name as building_name, comp.name as company_name
                from building bld
                    INNER JOIN company comp ON bld.company_id = comp.id
                where comp.status = 1
                and bld.status = 1
                '''
        for rec in conn.select_dict(sql):
            building = {}
            building['building_id'] = rec['building_id']
            building['building_name'] = rec['building_name']
            building['company_name'] = rec['company_name']
            buildings.append(building)
    
    return buildings


def _get_meter_point_id(building_id: int):
    with DBConnection() as conn:
        sql = '''select pt.id as point_id, pt.path as point_path, ast.id as asset_id
            from point pt
                INNER JOIN asset ast ON pt.asset_id = ast.id
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
                INNER JOIN building bld ON ast.building_id = bld.id
                INNER JOIN company comp ON bld.company_id = comp.id
                INNER JOIN unit ut ON pt.unit_id = ut.id
            where comp.status = 1
            and bld.status = 1
            and bld.id = %s
            and at.name = 'Meter'
            and ut.symbol = 'kW'
        '''
        recs = conn.select_dict(sql, [building_id])
        if recs:
            return recs[0]['point_id'], recs[0]['point_path'], recs[0]['asset_id']
    
    return None


def _has_n4_credentials(building_id):
    with DBConnection() as conn:
        sql = 'select * from n4_credential where building_id = %s'
        return bool(conn.select_dict(sql, [building_id]))
        
def _get_latest_value_ts(building_id):
    with DBConnection() as conn:
        sql = 'select ts from history where point_id = %s order by id desc limit 1'
        recs = conn.select_dict(sql, [building_id])
        if recs:
            return recs[0]['ts']
    
    return None


if __name__ == '__main__':
    run()