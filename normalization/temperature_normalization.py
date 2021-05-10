
from datetime import datetime

from normalization.degree_days import DegreeDays
from normalization.degree_days import Breakdown


class TemperatureNormalization:

    CNT_OF_YEARS_FOR_AVG = 6
    def __init__(self):
        self.dt_to_degree_days = None
        self.current_month = None
        self.degree_days = DegreeDays()

    def _compute_average_degree_days(self, dt_to_degree_days: dict, any_dt_in_period: datetime):
        month_sum = 0
        for dt, val in dt_to_degree_days.items():
            if dt.month == any_dt_in_period.month:
                month_sum += val

        return (month_sum / self.CNT_OF_YEARS_FOR_AVG)

    def normalize_values(self, curr_year: int, month_and_values: list, zipcode: str):
        # Read degree days for last X number of periods
        dt_to_degree_days = self.degree_days.get_dd(zipcode, Breakdown.MONTHLY, self.CNT_OF_YEARS_FOR_AVG * 12)

        _now = datetime.now()
        normalized_month_and_values = []
        for month_no, year_to_val in month_and_values:
            # Pick middle of the month
            any_dt_in_period = _now.replace(month=month_no, day=15)

            nomalized_year_to_val = {'curr_year': None, 'last_year': None}
            for key_name, yr in [('curr_year', curr_year), ('last_year', curr_year-1)]:
                if year_to_val[key_name]:
                    any_dt_in_period = any_dt_in_period.replace(year=yr)
                    # Average for the period over last CNT_OF_YEARS_FOR_AVG years
                    avg_for_period = self._compute_average_degree_days(dt_to_degree_days, any_dt_in_period)
                    # Degree Day of the period
                    period_dd = None
                    for dt, val in dt_to_degree_days.items():
                        if dt.month == any_dt_in_period.month and dt.year == any_dt_in_period.year:
                            period_dd = val
                            break

                    normalized_dd = (year_to_val[key_name] / period_dd) * avg_for_period
                    nomalized_year_to_val[key_name] = round(normalized_dd, 1)

            normalized_month_and_values.append((month_no, nomalized_year_to_val))

        return normalized_month_and_values

if __name__ == '__main__':
    temp_normalization = TemperatureNormalization()

    dt_1 = datetime(2020, 5, 1)
    print(temp_normalization.normalize(100, dt_1, '10012'))