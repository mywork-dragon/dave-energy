
from datetime import datetime, timedelta

from data.cache.cache import Cache

class TestCache:

    def test_get_secs_to_start_of_next_month(self):
        _now = datetime.now()
        _1_hr_past_midnight = datetime(day=_now.day, month=_now.month, year=_now.year, hour=1, minute=0, second=0)
        curr_month = _now.month
        while curr_month == _1_hr_past_midnight.month:
            _1_hr_past_midnight = _1_hr_past_midnight + timedelta(days=1)
        first_of_next_month = _1_hr_past_midnight
        assert abs(datetime.timestamp(first_of_next_month) - Cache.get_secs_to_start_of_next_month()) < 5