
from datetime import datetime
import pytz
from dateutil.relativedelta import relativedelta
import traceback

from config import logger
from common import slack
from data.db_connection import DBConnection
from scheduled_jobs.solar_edge.solar_edge import SolarEdge


EST_TZ = pytz.timezone("America/New_York")
LOOKBACK_BUFFER_IN_DAYS = 2

def run():
    creds = _get_credentials()

    for cred in creds:
        try:
            logger.info('Reading Solar Edge data for asset: {}'.format(cred['asset_id']))
            solar_edge = SolarEdge(cred['site_id'], cred['api_key'])

            # Get Solar Edge points
            se_power_pt, se_energy_pt = _get_solar_edge_points(cred['asset_id'])
            if not se_power_pt or not se_energy_pt:
                logger.warning('Power and/or energy points are not set for the Solar Asset, {}'.format(cred['asset_id']))
                slack.send_alert('Power and/or energy points are not set for the Solar Asset, {}'.format(cred['asset_id']))

            power_data, energy_data = [], []
            for solar_pt in [se_power_pt, se_energy_pt]:
                if not solar_pt:
                    logger.info('Solar point is not present.')
                    continue
                # Get last value read's timestamp
                max_ts_read = _last_read_ts_in_db(solar_pt['id'])
                if not max_ts_read:
                    # TODO: Check if 1 month is enough
                    logger.info('Data has never been read for this point from Solar Edge. Reading for last one year.')
                    max_ts_read = datetime.now() - relativedelta(months=1)
                logger.info('Timestamp of latest data for point {} is, {}'.format(solar_pt['id'], max_ts_read))
                if 'power' in solar_pt['path'].lower():
                    power_data = solar_edge.get_power_data(max_ts_read.astimezone(EST_TZ))
                    logger.info('Read {} power values.'.format(len(power_data)))
                elif 'energy' in solar_pt['path'].lower():
                    energy_data = solar_edge.get_energy_data(max_ts_read.astimezone(EST_TZ))
                    logger.info('Read {} energy values.'.format(len(energy_data)))

            # Write to db
            _write_to_db(se_power_pt['id'], power_data)
            _write_to_db(se_energy_pt['id'], energy_data)
        except:
            logger.info('Error while reading Solar Edge values for building: {}, asset: {}'.format(
                    cred['building_name'], cred['asset_name']
                ))
            logger.error(traceback.format_exc())
            slack.send_alert('Error while reading Solar Edge values for building: {}, asset: {}. \n{}'.format(
                    cred['building_name'], cred['asset_name'],
                    traceback.format_exc()
                ))


def _get_credentials():
    creds = []
    with DBConnection() as conn:
        sql = '''select sec.site_id, sec.api_key, sec.asset_id, ast.name as asset_name, bld.name as building_name
                from solar_edge_credential sec
                    INNER JOIN asset ast ON sec.asset_id = ast.id
                    INNER JOIN building bld ON ast.building_id = bld.id
                '''
        for rec in conn.select_dict(sql):
            cred = {}
            cred['asset_id'] = rec['asset_id']
            cred['site_id'] = rec['site_id']
            cred['api_key'] = rec['api_key']
            cred['asset_name'] = rec['asset_name']
            cred['building_name'] = rec['building_name']
            creds.append(cred)

    return creds


def _get_solar_edge_points(asset_id):
    se_power_pt, se_energy_pt = None, None
    with DBConnection() as conn:
        sql = '''select id, path
            from point
            where asset_id = %s
            and path ilike '%%solaredge%%'
            '''
        for rec in conn.select_dict(sql, [asset_id]):
            if 'power' in rec['path'].lower():
                se_power_pt = {
                    'id': rec['id'],
                    'path': rec['path']
                }
            if 'energy' in rec['path'].lower():
                se_energy_pt = {
                    'id': rec['id'],
                    'path': rec['path']
                }
    return se_power_pt, se_energy_pt


def _last_read_ts_in_db(point_id):
    with DBConnection() as conn:
        sql = '''select max(hist.ts) as max_ts
            from history hist
            where hist.point_id = %s
            '''
        recs = conn.select_dict(sql, [point_id])
        if recs[0]['max_ts']:
            last_read_ts = recs[0]['max_ts'].astimezone(EST_TZ) - relativedelta(days=LOOKBACK_BUFFER_IN_DAYS)
            return last_read_ts

    # TODO: Check if 1 month is enough
    logger.info('Data has never been read for this point from Solar API. Reading for last one month.')
    return datetime.now() - relativedelta(months=1)


def _write_to_db(point_id, solar_data):
    with DBConnection() as conn:
        for val in solar_data:
            sql = '''insert into history (point_id, ts, quantity, created_at) values (%s, %s, %s, NOW())
                ON CONFLICT (point_id, ts) DO UPDATE SET quantity = %s
                '''
            conn.execute(sql, [point_id, val['dt'], val['value'], val['value']])


if __name__ == '__main__':
    run()