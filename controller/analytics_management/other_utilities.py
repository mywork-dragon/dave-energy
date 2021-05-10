
from datetime import datetime, timedelta
from enum import Enum

from models.bill_history import BillHistory

class UtilityUnit(Enum):
    Gas = "therms"
    Steam = "mlbs"


class OtherUtilities:

    def __init__(self):
        pass

    def get_last_billing_cycle_cost(self, building_id: int, utility_unit: UtilityUnit):
        bill_history_last = self._get_latest_bill_history(building_id, utility_unit)
        if bill_history_last:
            return round(bill_history_last.bill_amount_cents / 100, 2)
        return None

    def get_last_billing_cycle_usage(self, building_id: int, utility_unit: UtilityUnit):
        bill_history_last = self._get_latest_bill_history(building_id, utility_unit)
        if bill_history_last:
            return bill_history_last.usage
        return None

    def _get_latest_bill_history(self, building_id: int, utility_unit: UtilityUnit):
        _3_months_ago = datetime.now() - timedelta(days=3*30)
        bill_history_last = BillHistory.query.filter_by(building_id=building_id) \
                                             .filter(BillHistory.unit==utility_unit.value) \
                                             .order_by(BillHistory.id.desc()).first()
        if bill_history_last and bill_history_last.to_dt > _3_months_ago.date():
            return bill_history_last
        return None

    def get_ytd_cost(self, building_id: int, year: int, utility_unit: UtilityUnit):
        bills = BillHistory.query.filter_by(building_id=building_id) \
                                 .filter(BillHistory.unit==utility_unit.value) \
                                 .filter(BillHistory.to_dt >= '{}-01-01'.format(year)).all()
        if bills:
            sum_ytd = 0
            for bill in bills:
                sum_ytd += round(bill.bill_amount_cents / 100, 2)
            return sum_ytd

        return None


    def get_ytd_usage(self, building_id: int, year: int, utility_unit: UtilityUnit):
        bills = BillHistory.query.filter_by(building_id=building_id) \
                                 .filter(BillHistory.unit==utility_unit.value) \
                                 .filter(BillHistory.to_dt >= '{}-01-01'.format(year)).all()
        if bills:
            sum_ytd = 0
            for bill in bills:
                sum_ytd += bill.usage
            return sum_ytd

        return None