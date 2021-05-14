
from datetime import datetime

from data.db_energy_curves_connection import DBEnergyCurvesConnection


class LMP:

    def __init__(self, dt_beginning, price, is_real_time, hr_ending, zone_id, zone_name):
        self.dt_beginning = dt_beginning
        self.price = price
        self.is_real_time = is_real_time
        self.hr_ending = hr_ending
        self.zone_id = zone_id
        self.zone_name = zone_name

    
    def persist(self):
        print("Persisting: {}, {}, {}, {}, {}".format(self.dt_beginning, self.hr_ending, self.is_real_time, self.zone_id, self.price))
        with DBEnergyCurvesConnection() as conn:
            sql = """insert into lmp (dt, price, is_real_time, hr_ending, zone_id, utc_created)
                values (%s, %s, %s, %s, %s, %s)
                on conflict (dt, hr_ending, zone_id, is_real_time, price)
                do nothing
                """
            conn.execute(sql, [self.dt_beginning, self.price, self.is_real_time, self.hr_ending,
                               self.zone_id, datetime.utcnow()
                            ])