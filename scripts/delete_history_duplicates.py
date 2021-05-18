
from data.db_connection import DBConnection


def run():
    with DBConnection() as conn:
        sql = '''select distinct hist.id, hist.point_id, hist.ts, hist.quantity
            from history hist
            where (select count(*) from history hist1
            where hist.point_id = hist1.point_id and hist.ts = hist1.ts) > 1
            order by id
            '''
        for rec in conn.select_dict(sql):
            oldest_id = rec["id"]
            point_id = rec["point_id"]
            ts = rec["ts"]

            print("Finding duplicates of id: {}, {}, {}, {}".format(oldest_id, point_id, ts, rec["quantity"]))
            sql = '''select id, point_id, ts, quantity
                from history
                where point_id = %s
                and ts = %s
                and id <> %s
                '''
            for rs in conn.select_dict(sql, [point_id, ts, oldest_id]):
                print("Duplicate: {}, {}, {}, {}".format(rs["id"], rs["point_id"], rs["ts"], rs["quantity"]))
                sql = 'delete from history where id = %s'
                conn.execute(sql, [rs["id"]])


if __name__ == '__main__':
    run()