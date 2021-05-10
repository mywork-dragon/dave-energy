
from datetime import datetime
from dateutil.relativedelta import relativedelta

from config import logger
from data.db_connection import DBConnection
from scheduled_jobs.niagara4.events.dcm_crossed_peak import DCMCrossedPeak

CRON_FREQ_IN_SECS=60

def run():
    buildings_ids = _get_recently_updated_billing_peak_building_ids()
    if not buildings_ids:
        logger.info('Billing peak was recently not updated for any of the buildings.')

    for building_id in buildings_ids:
        logger.info('Billing peak was recently updated for building, {}, running event handler.'.format(building_id))
        DCMCrossedPeak().create_event(building_id)

def _get_recently_updated_billing_peak_building_ids():
    building_ids = []
    _window = datetime.utcnow() - relativedelta(minutes=CRON_FREQ_IN_SECS+10)
    with DBConnection() as conn:
        sql = '''select bld.id
            from billing_peak bp
                INNER JOIN building bld ON bp.building_id = bld.id
                INNER JOIN company comp ON bld.company_id = comp.id
            where bld.status = 1
            and comp.status = 1
            and bp.updated_at > %s
            '''
        for rec in conn.select_dict(sql, [_window]):
            building_ids.append(rec['id'])

    return building_ids


if __name__ == '__main__':
    run()