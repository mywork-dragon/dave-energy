
import os
import pysftp

from aws.secrets_manager import SecretsManager, SecretName


class DNVSftp:

    # 3000 Atrium
    BUILDING_IDS = [5]
    # JRS
    BUILDING_IDS.extend([1, 81, 82, 84, 85])
    def get_sftp_connection(self):
        ftp_credentials = SecretsManager.get_instance().get_secret(SecretName.DNVFTPCredentials)
        cnopts = pysftp.CnOpts()
        cnopts.hostkeys = None 
        return pysftp.Connection(ftp_credentials["host"],
                               username=ftp_credentials["username"],
                               password=ftp_credentials["password"],
                               cnopts=cnopts)