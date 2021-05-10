
import pytz

from pyhaystack.client.niagara import Niagara4HaystackSession
import hszinc

from scheduled_jobs import lcl_utils

def test():
    tz = pytz.timezone('UTC')
    session = Niagara4HaystackSession(
        # uri='https://34.203.113.170:443',
        # username='daniel',
        # password='daniel2',
        uri='https://23.24.87.6:443',
        username='Energy',
        password='control2555',
        http_args=dict(tls_verify=False, debug=True),
        pint=False,
    )
    op = session.his_read("S.~33000Atrium.ElectricMeter.Pwr", rng='today')
    op.wait()
    for row in op.result._row:
        dt_in_tz = row["ts"].astimezone(tz)
        print(row["ts"], row["val"].value, dt_in_tz)

def test_write():
    n4_session = lcl_utils.get_n4_connection(5)
    # S.~33000Atrium.Settings.EventEn
    # S.~33000Atrium.Settings.EventType
    resp = n4_session.invoke_action("S.~33000Atrium.Settings.EventEn", "set", val=False)
    result = hszinc.dump(resp.result, hszinc.MODE_JSON)
    print(resp.is_done, resp.is_failed)


if __name__ == '__main__':
    test_write()
