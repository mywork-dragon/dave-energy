
from datetime import timedelta

from data.db_connection import DBConnection
from models.unit import Unit


class GasAndSteam:

    Therms = Unit.query.filter_by(symbol="Therms").first()
    MLBS = Unit.query.filter_by(symbol="Mlbs").first()
    def get_gas_cost_ytd(self, building_id, year):
        return self._get_cost_ytd(building_id, year, GasAndSteam.MLBS.id)

    def get_gas_cost_curr_cycle(self, building_id, dt_in_cycle):
        return self._get_cost_curr_cycle(building_id, dt_in_cycle, GasAndSteam.MLBS.id)

    def get_date_in_latest_gas_billing_cycle(self, building_id):
        return self._get_date_in_latest_billing_cycle(building_id, GasAndSteam.MLBS.id)


    def get_steam_cost_ytd(self, building_id, year):
        return self._get_cost_ytd(building_id, year, GasAndSteam.Therms.id)

    def get_steam_cost_curr_cycle(self, building_id, dt_in_cycle):
        return self._get_cost_curr_cycle(building_id, dt_in_cycle, GasAndSteam.Therms.id)

    def get_date_in_latest_steam_billing_cycle(self, building_id):
        return self._get_date_in_latest_billing_cycle(building_id, GasAndSteam.Therms.id)

    def _get_cost_ytd(self, building_id, year, unit_id):
        with DBConnection() as conn:
            sql = '''select sum(bill_amount_cents) as amount_ytd
                from bill_history
                where building_id = %s
                and date_part('year', to_dt) = %s
                and unit_id = %s
            '''
            recs = conn.select_dict(sql, [building_id, year, unit_id])
            if recs[0]['amount_ytd']:
                return round(int(recs[0]['amount_ytd']) / 100, 2)

        return None

    def _get_cost_curr_cycle(self, building_id, dt_in_cycle, unit_id):
        with DBConnection() as conn:
            sql = '''select bill_amount_cents
                from bill_history
                where building_id = %s
                and (from_dt <= %s and %s <= to_dt)
                and unit_id = %s
            '''
            recs = conn.select_dict(sql, [building_id, dt_in_cycle, dt_in_cycle, unit_id])
            if recs:
                return round(int(recs[0]['bill_amount_cents']) / 100, 2)

        return None

    def _get_date_in_latest_billing_cycle(self, building_id, unit_id):
        with DBConnection() as conn:
            sql = '''select from_dt, to_dt
                from bill_history
                where building_id = %s
                and unit_id = %s
                order by to_dt desc
                limit 1
            '''
            recs = conn.select_dict(sql, [building_id, unit_id])
            if recs:
                start_dt = recs[0]['from_dt']
                end_dt = recs[0]['to_dt']
                half_of_diff = int((end_dt - start_dt).days/2)
                return start_dt + timedelta(days=half_of_diff)

        return None


if __name__ == '__main__':
    gas_and_steam = GasAndSteam()
    dt_in_cycle = gas_and_steam.get_date_in_latest_steam_billing_cycle(82)
    print(gas_and_steam.get_steam_cost_curr_cycle(82, dt_in_cycle))