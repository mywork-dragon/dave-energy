# type: ignore

from datetime import datetime, timedelta
import time

from dateutil.relativedelta import relativedelta
from flask import Flask
from flask_caching import Cache as FlaskCaching

from aws.secrets_manager import SecretsManager, SecretName

class HostedCache:

    instance = None
    def __init__(self):
        if not HostedCache.instance is None:
            raise Exception('Cache is supposed to be instantiated only once. Please use get_instance() for accessing the Singleton.')

        secrets_manager = SecretsManager()
        memcachier_creds = secrets_manager.get_secret(SecretName.Memcachier)
        servers = [memcachier_creds['memcachier/server']]
        user = memcachier_creds['memcachier/username']
        passwd = memcachier_creds['memcachier/password']

        self.flask_caching = FlaskCaching()
        self.app = Flask(__name__)
        self.flask_caching.init_app(self.app,
            config={'CACHE_TYPE': 'saslmemcached',
                    'CACHE_MEMCACHED_SERVERS': servers,
                    'CACHE_MEMCACHED_USERNAME': user,
                    'CACHE_MEMCACHED_PASSWORD': passwd,
                    'CACHE_OPTIONS': { 'behaviors': {
                        # Faster IO
                        'tcp_nodelay': True,
                        # Keep connection alive
                        'tcp_keepalive': True,
                        # Timeout for set/get requests
                        'connect_timeout': 2000, # ms
                        'send_timeout': 750 * 1000, # us
                        'receive_timeout': 750 * 1000, # us
                        '_poll_timeout': 2000, # ms
                        # Better failover
                        'ketama': True,
                        'remove_failed': 1,
                        'retry_timeout': 2,
                        'dead_timeout': 30}}})

    def set(self, key_name: str, val):
        with self.app.app_context():
            self.flask_caching.set(key_name, val, HostedCache.get_secs_to_start_of_next_month())

    def get(self, key_name: str):
        with self.app.app_context():
            return self.flask_caching.get(key_name)

    @staticmethod
    def get_instance():
        if HostedCache.instance is None:
            HostedCache.instance = HostedCache()

        return HostedCache.instance

    @staticmethod
    def get_secs_to_start_of_next_month():
        _now = datetime.now()
        _1_hr_past_midnight = datetime(day=_now.day, month=_now.month, year=_now.year, hour=1, minute=0, second=0)
        first_of_next_month = _1_hr_past_midnight.replace(day=1) + relativedelta(months=1)
        return int(datetime.timestamp(first_of_next_month))
