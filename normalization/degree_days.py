
from enum import Enum

from degreedays.api import DegreeDaysApi, AccountKey, SecurityKey
from degreedays.api.data import DataSpec, Calculation, Temperature, \
    DatedBreakdown, Period, Location, DataSpecs, LocationDataRequest

from aws.secrets_manager import SecretsManager, SecretName
from data.cache.redis_cache import RedisCache

BASE_TEMP = 65

class Breakdown(Enum):
    MONTHLY = DatedBreakdown.monthly
    WEEKLY = DatedBreakdown.weekly
    DAILY = DatedBreakdown.daily

class DegreeDays:

    def __init__(self):
        secrets_manager = SecretsManager()
        dd_keys = secrets_manager.get_secret(SecretName.DegreeDays)
        self.api = DegreeDaysApi.fromKeys(
            AccountKey(dd_keys['account_key']),
            SecurityKey(dd_keys['security_key']))
        self.redis_cache = RedisCache.get_instance()

    def _get_hdd_spec(self, breakdown: Breakdown, count_of_periods: int):
        return DataSpec.dated(
            Calculation.heatingDegreeDays(Temperature.fahrenheit(BASE_TEMP)),
            breakdown(Period.latestValues(count_of_periods)))

    def _get_cdd_spec(self, breakdown: Breakdown, count_of_periods: int):
        return DataSpec.dated(
            Calculation.coolingDegreeDays(Temperature.fahrenheit(BASE_TEMP)),
            breakdown(Period.latestValues(count_of_periods)))

    def get_dd(self, zipcode: str, breakdown: Breakdown, count_of_periods=12):
        # Check cache
        cache_key = '{}_{}_{}'.format(zipcode, breakdown.__name__, count_of_periods)
        day_to_dd = self.redis_cache.get(cache_key)
        if day_to_dd is None:
            hdd_spec = self._get_hdd_spec(breakdown, count_of_periods)
            cdd_spec = self._get_cdd_spec(breakdown, count_of_periods)

            request = LocationDataRequest(
                Location.postalCode(zipcode, 'US'),
                DataSpecs(hdd_spec, cdd_spec))
            response = self.api.dataApi.getLocationData(request)

            hddData = response.dataSets[hdd_spec]
            cddData = response.dataSets[cdd_spec]

            day_to_dd = {}
            for val in hddData.values:
                day_to_dd[val.firstDay] = val.value
            for val in cddData.values:
                day_to_dd[val.firstDay] += val.value
                day_to_dd[val.firstDay] = round(day_to_dd[val.firstDay], 2)

            self.redis_cache.set(cache_key, day_to_dd)

        return day_to_dd

if __name__ == '__main__':
    dd = DegreeDays()
    print(dd.get_dd('10010', Breakdown.MONTHLY, 72))