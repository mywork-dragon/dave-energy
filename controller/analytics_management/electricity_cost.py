
from config import logger
from data.db_connection import DBConnection
from third_party.utility_api.utility_api_wrapper import UtilityApiWrapper


class ElectricityCost:

    def __init__(self):
        self.utility_api_wrapper = UtilityApiWrapper()

    
    def get_cost_ytd(self, building_id, building_address, year):
        total_cost = None
        # Supply cost
        with DBConnection() as conn:
            sql = '''select sum(bill_amount_cents) as amount_ytd
                from bill_history
                where building_id = %s
                and date_part('year', to_dt) = %s
                and unit_id is null
            '''
            recs = conn.select_dict(sql, [building_id, year])
            if recs[0]['amount_ytd'] is not None:
                total_cost = round(int(recs[0]['amount_ytd']) / 100, 2)
                logger.info('Supply cost from bill history for {}, is: ${}'.format(year, total_cost))

        # Consumption cost
        cost_ytd_curr_year = self.utility_api_wrapper.get_cost_ytd(year, [building_address])
        if cost_ytd_curr_year:
            logger.info('UtilityApi cost for {}, is: ${}'.format(year, cost_ytd_curr_year))
            total_cost = cost_ytd_curr_year + total_cost if total_cost else cost_ytd_curr_year

        return total_cost
    

    def get_cost_latest_billing_cycle(self, building_id, building_address, dt_in_cycle):
        total_cost = None
        with DBConnection() as conn:
            sql = '''select bill_amount_cents
                from bill_history
                where building_id = %s
                and (from_dt <= %s and %s <= to_dt)
            '''
            recs = conn.select_dict(sql, [building_id, dt_in_cycle, dt_in_cycle])
            if recs:
                total_cost = round(int(recs[0]['bill_amount_cents']) / 100, 2)
                logger.info('Supply cost from bill history for billing cycle with date {}, is: ${}'.format(dt_in_cycle, total_cost))

        lastest_billing_cycle_cost = self.utility_api_wrapper.get_cost_curr_cycle(dt_in_cycle, [building_address])
        if lastest_billing_cycle_cost:
            logger.info('UtilityApi cost for billing cycle with date {}, is: ${}'.format(dt_in_cycle, lastest_billing_cycle_cost))
            total_cost = lastest_billing_cycle_cost + total_cost if total_cost else lastest_billing_cycle_cost

        return total_cost