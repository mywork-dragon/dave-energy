
import pytz
from calendar import month_abbr
from datetime import datetime
from typing import Any, Dict, Optional, Tuple, List

from common import utils, point_utils, history_utils
from data.db_connection import DBConnection
from models.billing_cycle import BillingCycle
from models.building import Building
from models.point import Point
from third_party.utility_api.utility_api_wrapper import UtilityApiWrapper


class ConsumptionDetails:

    def __init__(self):
        self.utility_api_wrapper = UtilityApiWrapper()
        self.year_to_month_to_values = {}


    def get_energy_consumption_by_month(self, building: Building, year: int):
        year_data = []
        bc_from_day = building.billing_cycles[0].from_day
        meter_points = point_utils.get_asset_points(building.id, "Meter", tag="METER")
        meter_point_ids = [point["point_id"] for point in meter_points]
        for month_idx in range(1, 13):
            month_data = {
                "month_number": month_idx,
                "month_display": month_abbr[month_idx][0],
                "unit": "kWh",
            }
            utc_bc_start_time, utc_bc_end_time = utils.get_billing_cycle_limits_in_utc(bc_from_day, month_idx, year)
            if utc_bc_start_time > datetime.utcnow().replace(tzinfo=pytz.utc):
                month_data["quantity"] = 0
                year_data.append(month_data)
                continue

            bc_demand_data = history_utils.get_summed_point_history(meter_point_ids, utc_bc_start_time, utc_bc_end_time)
            if not bc_demand_data:
                month_value = self._read_from_api(building, year, month_idx)
                if month_value:
                    month_data["quantity"] = month_value
                else:
                    month_data["quantity"] = 0
                year_data.append(month_data)
                continue

            month_data["quantity"] = sum([ts_and_quantity["quantity"] for ts_and_quantity in bc_demand_data]) / 4
            year_data.append(month_data)
        
        return year_data


    def _read_from_api(self, building: Building, year: int, month_idx: int):
        building_address = building.service_address if building.service_address else building.address
        if not year in self.year_to_month_to_values:
            self.year_to_month_to_values[year] = self.utility_api_wrapper.get_energy_consumption_by_cycle(year, building_address)
        
        return self.year_to_month_to_values[year][month_idx]