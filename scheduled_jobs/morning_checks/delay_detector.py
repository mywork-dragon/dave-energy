
from data.db_connection import DBConnection


class DelayDetector:

    def __init__(self):
        pass

    def run(self):
        # For every active company, for every active building, for every electric meter,
        # find the difference in secs of latest read from N4 and the previous 15 min interval
        delayed_point_reads = []
        with DBConnection() as conn:
            sql = '''select pt.id as point_id, pt.path as point_path, bld.name as building_name, 
                comp.name as company_name, hist.ts
                from point pt
                    inner join asset ast on pt.asset_id = ast.id
                    inner join asset_type ast_typ on ast.asset_type_id = ast_typ.id
                    inner join building bld on ast.building_id = bld.id
                    inner join company comp on bld.company_id = comp.id
                    inner join history hist on pt.id = hist.point_id
                where comp.status = 1
                and bld.status = 1
                and pt.tag = 'METER'
                and ast_typ.name = 'Meter'
                and ast.energy_type = 'electric'
                and hist.id = (select hist1.id from history hist1 where hist1.point_id = pt.id order by hist1.id desc limit 1)
                order by bld.id
                '''
            for rec in conn.select_dict(sql):
                ts = rec["ts"]
                delay_after_15th = ts.second
                delay_after_15th += (ts.minute % 15) * 60
                print(delay_after_15th)
                print(rec["point_id"], rec["point_path"], rec["building_name"], rec["company_name"], rec["ts"])
                # if delay_after_15th > 90:
                #     delayed_point_reads.append({
                #         "point_id": rec["point_id"],
                #         "point_name": rec["point_name"],
                #         "": rec["building_name"],
                #         "": rec["company_name"],
                #         "delay_in_secs": delay_after_15th,
                #     })

if __name__ == "__main__":      
    dd = DelayDetector()
    dd.run()