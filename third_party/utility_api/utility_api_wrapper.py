# type: ignore

from datetime import datetime

from collections import defaultdict
from datetime import datetime, timedelta
import pytz

from third_party.utility_api.utility_api import UtilityAPI

class UtilityApiWrapper:

    UTILITY_API_DATE_FORMAT = '%Y-%m-%dT%H:%M:%S.%f%z'
    def __init__(self):
        pass

    def get_cost_ytd(self, year: int, building_addresses: list):
        _dt_of_year = datetime.now(pytz.timezone("America/New_York")).replace(year=year)
        return self._get_value_ytd(_dt_of_year, building_addresses, 'bill_total_cost')

    def get_cost_curr_cycle(self, dt_in_cycle: datetime, building_addresses: list):
        return self._get_val_curr_cycle(dt_in_cycle, building_addresses, 'bill_total_cost')

    def get_energy_consumption_ytd(self, year: int, building_addresses: list):
        _dt_of_year = datetime.now(pytz.timezone("America/New_York")).replace(year=year)
        return self._get_value_ytd(_dt_of_year, building_addresses, 'bill_total_kwh')

    def get_energy_consumption_curr_cycle(self, dt_in_cycle: datetime, building_addresses: list):
        return self._get_val_curr_cycle(dt_in_cycle, building_addresses, 'bill_total_kwh')

    def get_cost_by_cycle(self, year: int, building_addresses: list):
        return self._get_value_by_cycle(year, building_addresses, 'bill_total_cost')

    def get_energy_consumption_by_cycle(self, year: int, building_addresses: list):
        return self._get_value_by_cycle(year, building_addresses, 'bill_total_kwh')

    def get_energy_demand_ytd(self, year: int, building_addresses: list):
        '''
        For the given year find the YTD energy demand(kW) value from Jan up until the today's date for that year
        Energy demand is the max kW value we have come across in the time period. Some bills for summer months
        will have Annual Demand and Summer Demand, please pick the max of the two. Some bills will have kW values
        for Demand Delivery and Demand Supply, both will be the same value, we need to pick any one of them.
        If we don't have data from Jan of the year, we return None
        '''
        _dt_of_year = datetime.now(pytz.timezone("America/New_York")).replace(year=year)
        ytd_val = None
        has_jan_value = False
        for bill in UtilityAPI.get_instance().get_bill_data(building_addresses):
            end_dt = datetime.strptime(bill['base']['bill_end_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
            if end_dt.year == _dt_of_year.year and _dt_of_year >= end_dt:
                for line_item in bill['line_items']:
                    if line_item['unit'] == 'kw' and line_item['volume']:
                        if ytd_val is None or int(line_item['volume']) > ytd_val:
                            ytd_val = int(line_item['volume'])

                start_dt = datetime.strptime(bill['base']['bill_start_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                if start_dt.month == 1:
                    has_jan_value = True
        if has_jan_value:
            return ytd_val
        else:
            # Utility API does not have data from the beginning of the year, YTD value can't be computed
            return None


    def get_energy_demand_curr_cycle(self, dt_in_cycle: datetime, building_addresses: list):
        '''
        For the last billing cycle find the energy demand(kW) value.
        Energy demand is the max kW value. Some bills for summer months will have Annual Demand and Summer
        Demand, please pick the max of the two. Some bills will have kW values for Demand Delivery and
        Demand Supply, both will be the same value, we need to pick any one of them.
        '''
        meter_uids = UtilityAPI.get_instance().get_meter_uids(building_addresses)
        bills = UtilityAPI.get_instance().get_bill_data(building_addresses)
        for meter_uid in meter_uids:
            for bill in bills:
                # First bill which has the meter uid is for the current cycle
                if bill['meter_uid'] == meter_uid:
                    start_dt = datetime.strptime(bill['base']['bill_start_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                    end_dt = datetime.strptime(bill['base']['bill_end_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                    if start_dt <= dt_in_cycle and dt_in_cycle <= end_dt:
                        max_kw = None
                        for line_item in bill['line_items']:
                            if line_item['unit'] == 'kw':
                                # There will be two line items with unit of kw, one is for Demand supply and Demand delivery
                                # The volume will be same for both these line items, we need volume(energy demand) of one of these
                                if max_kw is None or line_item['volume'] > max_kw:
                                    max_kw = line_item['volume']
                        return max_kw

        return None

    def get_energy_demand_by_cycle(self, year: int, building_addresses: list):
        '''
        For the year, return for each billing cycle month and kW value
        Energy demand is the max kW value in the items in the line_items. Some bills for summer months will have
        Annual Demand and Summer Demand, please pick the max of the two. Some bills will have kW values for
        Demand Delivery and Demand Supply, both will be the same value, we need to pick any one of them.
        '''
        cycle_to_val = defaultdict(int)
        for bill in UtilityAPI.get_instance().get_bill_data(building_addresses):
            if bill['base']['bill_end_date'].startswith(str(year)):
                month_indexes = self._which_months(bill['base']['bill_start_date'], bill['base']['bill_end_date'], year)
                if not month_indexes:
                    continue
                max_kw = None
                for line_item in bill['line_items']:
                    if line_item['unit'] == 'kw':
                        if max_kw is None or line_item['volume'] > max_kw:
                            max_kw = line_item['volume']
                if not max_kw:
                    continue

                split_val = max_kw / len(month_indexes)
                for month_idx in month_indexes:
                    if cycle_to_val[month_idx]:
                        cycle_to_val[month_idx] += split_val
                    else:
                        cycle_to_val[month_idx] = split_val

        return cycle_to_val

    def get_date_in_latest_billing_cycle(self, building_address):
        bills = UtilityAPI.get_instance().get_bill_data([building_address])
        if bills:
            start_dt = datetime.strptime(bills[0]['base']['bill_start_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
            end_dt = datetime.strptime(bills[0]['base']['bill_end_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
            half_of_diff = int((end_dt - start_dt).days/2)
            return start_dt + timedelta(days=half_of_diff)

        return None

    def _get_value_ytd(self, dt_of_year: datetime, building_addresses: list, attribute_name: str):
        ytd_val = 0
        has_jan_value = False
        for bill in UtilityAPI.get_instance().get_bill_data(building_addresses):
            end_dt = datetime.strptime(bill['base']['bill_end_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
            if end_dt.year == dt_of_year.year and dt_of_year >= end_dt:
                ytd_val += bill['base'][attribute_name]

                start_dt = datetime.strptime(bill['base']['bill_start_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                if start_dt.month == 1:
                    has_jan_value = True
        if has_jan_value:
            return ytd_val
        else:
            # Utility API does not have data from the beginning of the year, YTD value can't be computed
            return None


    def _get_val_curr_cycle(self, dt_in_cycle: datetime, building_addresses: list, attribute_name: str):
        meter_uids = UtilityAPI.get_instance().get_meter_uids(building_addresses)
        bills = UtilityAPI.get_instance().get_bill_data(building_addresses)
        sum_val = 0
        for meter_uid in meter_uids:
            for bill in bills:
                # First bill which has the meter uid and the year is for the current cycle
                if bill['meter_uid'] == meter_uid:
                    start_dt = datetime.strptime(bill['base']['bill_start_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                    end_dt = datetime.strptime(bill['base']['bill_end_date'], UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
                    if start_dt <= dt_in_cycle and dt_in_cycle <= end_dt:
                        sum_val += bill['base'][attribute_name]
                        break
        return sum_val


    def _get_value_by_cycle(self, year: int, building_addresses: list, attribute_name: str):
        cycle_to_val = defaultdict(int)
        for bill in UtilityAPI.get_instance().get_bill_data(building_addresses):
            if bill['base']['bill_end_date'].startswith(str(year)):
                month_indexes = self._which_months(bill['base']['bill_start_date'], bill['base']['bill_end_date'], year)
                if month_indexes:
                    split_val = bill['base'][attribute_name] / len(month_indexes)
                    for month_name in month_indexes:
                        cycle_to_val[month_name] += split_val

        return cycle_to_val


    # Returns the month which has more than 20 days in the range
    # If both months have same number of days, returns the first month in the range
    @staticmethod
    def _which_months(start_dt_str: str, end_dt_str: str, year: int):
        start_dt = datetime.strptime(start_dt_str, UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
        end_dt = datetime.strptime(end_dt_str, UtilityApiWrapper.UTILITY_API_DATE_FORMAT)
        month_indexes = []

        if start_dt.month == end_dt.month:
            month_indexes = [start_dt.month]
        else:
            month_to_days = defaultdict(int)
            dt = start_dt
            while dt <= end_dt:
                month_to_days[dt.month] += 1
                dt = dt + timedelta(days=1)

            if len(month_to_days.keys()) == 2:
                first_month = start_dt.month
                end_month = end_dt.month
                if month_to_days[first_month] < month_to_days[end_month]:
                    month_indexes = [end_month]
                else:
                    month_indexes = [first_month]
            else:
                # Range has more than two months, skip months with less than 15 days
                for month, cnt_days in month_to_days.items():
                    if cnt_days < 15:
                        continue
                    month_indexes.append(month)
        
        # Remove months from last year
        indexes = []
        for month_idx in month_indexes:
            if start_dt.month == month_idx and start_dt.year != year:
                continue
            indexes.append(month_idx)

        return indexes