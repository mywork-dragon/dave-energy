

from data.db_connection import DBConnection



def run():
    with DBConnection() as conn:
        symbol_to_id = {}
        sql = 'select id, symbol from unit'
        for rec in conn.select_dict(sql):
            symbol_to_id[rec['symbol'].lower()] = rec['id']
        symbol_to_id['°f'] = 3

        sql = 'select id, unit from points where unit_id is null and unit is not null'
        for rec in conn.select_dict(sql):
            if rec['unit'].lower() in symbol_to_id:
                print([rec['unit'].lower(), symbol_to_id[rec['unit'].lower()], rec['id']])
                sql = 'update points set unit_id = %s where id = %s'
                conn.execute(sql, [symbol_to_id[rec['unit'].lower()], rec['id']])
            else:
                print(rec['unit'].lower(), rec['id'])


if __name__ == '__main__':
    run()