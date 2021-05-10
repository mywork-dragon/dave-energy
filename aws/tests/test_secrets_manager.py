
from unittest.mock import Mock
from unittest.mock import patch

from aws.secrets_manager import SecretsManager, SecretName


class TestSecretsManager:

    @patch('aws.secrets_manager.boto3')
    def test_get_secret(self, mock_boto3):
        secrets_manager = SecretsManager()
        mock_session = Mock()
        mock_boto3.session.Session.return_value = mock_session
        mock_client = Mock()
        mock_session.client.return_value = mock_client
        mock_client.get_secret_value.return_value = {'SecretString': '"{\'secret\': \'value\'}"'}

        secret = secrets_manager.get_secret(SecretName.DegreeDays)
        assert secret == "{'secret': 'value'}"