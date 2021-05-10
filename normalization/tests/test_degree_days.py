
from unittest.mock import Mock
from unittest.mock import patch

from normalization.degree_days import Breakdown, DegreeDays

hdd_spec = Mock()
cdd_spec = Mock()

class TestDegreeDays:

    @patch('normalization.degree_days.DegreeDays._get_hdd_spec', return_value=hdd_spec)
    @patch('normalization.degree_days.DegreeDays._get_cdd_spec', return_value=cdd_spec)
    @patch('normalization.degree_days.DegreeDaysApi')
    @patch('normalization.degree_days.AccountKey')
    @patch('normalization.degree_days.SecurityKey')
    @patch('normalization.degree_days.LocationDataRequest')
    @patch('normalization.degree_days.DataSpecs')
    @patch('normalization.degree_days.SecretsManager.get_secret', return_value=dict(account_key='test_account_key', security_key='test_security_key'))
    def test_get_dd(self, mock_get_secret, mock_DataSpecs, mock_LocationDataRequest, mock_SecurityKey, mock_AccountKey,
                    mock_DegreeDaysApi, mock__get_cdd_spec, mock__get_hdd_spec):
        mock_DegreeDaysApi.return_value.fromKeys.return_value = Mock()
        mock_DegreeDaysApi.return_value.dataApi.getLocationData.return_value = {
            hdd_spec: '',
            cdd_spec: ''
        }

        dd = DegreeDays()
        assert not dd.get_dd("10012", Breakdown.MONTHLY)