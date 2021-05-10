
import pytz
import traceback

from datetime import datetime
from dateutil.relativedelta import relativedelta
from multiprocessing import Process

from config import logger
from common import slack
from common import utils
from data.db_connection import DBConnection
from scheduled_jobs.niagara4.n4_reader import N4Reader
from scheduled_jobs.niagara4.n4_events_handler import N4EventHandler
from scheduled_jobs import lcl_utils
from scheduled_jobs.niagara4.events.dcm_crossed_peak import DCMCrossedPeak
from scheduled_jobs.niagara4.events import events_config

EST_TZ = pytz.timezone("America/New_York")
NIAGARA_READ_TIMEOUT_IN_SECS = 30

class Run:

    def copy_n4_values(self):
        # Read active buildings of active companies
        buildings = lcl_utils.get_active_buildings()
        logger.info('Found {} active buildings.'.format(len(buildings)))

        n4_event_handler = N4EventHandler()
        dcm_cross_peak = DCMCrossedPeak()
        for building in buildings:
            logger.info('**Copying N4 data for building: {}, of company: {}'.format(building['building_name'], building['company_name']))
            # Read N4 point
            points_info = self._get_n4_points(building['building_id'])
            if not points_info:
                logger.info('No N4 point info found, skipping building.')
                continue

            for pt_info in points_info:
                logger.info('N4 point: {}'.format(pt_info['point_id']))
                # Read the timestamp of latest data for the building
                max_ts_read = utils.last_read_ts_in_db(pt_info['point_id'])
            
                # Check if timestamp is within the window, so we don't have to read again
                _window_start = datetime.utcnow().replace(tzinfo=pytz.utc) - relativedelta(minutes=events_config.LOOKBACK_THRESHOLD_IN_MINS)
                if max_ts_read and max_ts_read > _window_start:
                    logger.info('Point, {}, was read within the window, skipping reading from N4.'.format(pt_info['point_id']))
                    continue

                if max_ts_read:
                    # TODO: Convert the latest time read from the db to the timezone of the building
                    max_ts_read = max_ts_read.astimezone(EST_TZ)
                    logger.info('Timestamp of latest data read: {}'.format(max_ts_read))
                else:
                    logger.info('Data has never been read for this point from N4. Reading from the first of the year.')
                    max_ts_read = datetime.utcnow().replace(tzinfo=pytz.utc).replace(month=1, day=1, hour=0)

                try:
                    # Read and save N4 data for the building from the latest data read to now
                    n4_reader = N4Reader(building['building_id'])
                    # n4_reader.copy_point_values(pt_info['point_id'], pt_info['point_path'], max_ts_read)
                    self._manage_process(n4_reader.copy_point_values,
                                         (pt_info['point_id'], pt_info['point_path'], max_ts_read))

                except:
                    logger.info('Error while reading N4 values for building id: {}, point id: {}, point path: {}'.format(
                        building['building_id'], pt_info['point_id'], pt_info['point_path']
                    ))
                    logger.error('Error while deleting: {}'.format(traceback.format_exc()))
                    slack.send_alert('Error while reading data from N4 for building: {}({}) for point: {}({}), \n {}'.format(
                        building['building_name'], building['building_id'], pt_info['point_path'], pt_info['point_id'],
                        traceback.format_exc()
                    ))
            
                # If Meter asset and METER point
                # Check if new value was read
                if pt_info['asset_type_name'] == 'Meter' and pt_info['tag_name'] == 'METER':
                    latest_ts_read = utils.last_read_ts_in_db(pt_info['point_id'])
                    if latest_ts_read and latest_ts_read > max_ts_read:
                        logger.info('New Meter value is read, checking on events.')
                        try:
                            # Check if events need to be generated for the latest data read for the building
                            is_event_created = dcm_cross_peak.create_event(building['building_id'])
                            # Check for existing events which need to be ended
                            n4_event_handler.dispatch_end_of_event(building['building_id'])
                        
                        except Exception as exc:
                            logger.error('Error while event creation for building: {}'.format(building['building_id']))
                            logger.error(traceback.format_exc())
                            slack.send_alert('Error while event creation for building: {}'.format(building['building_id']))
                            slack.send_alert(traceback.format_exc())

        try:
            self._manage_process(n4_event_handler.terminate_old_events)
        
        except Exception as exc:
            logger.error('Error while terminating old events.')
            logger.error(traceback.format_exc())
            slack.send_alert('Error while terminating old events.')


    # TODO: Replace tag values with point_type
    def _get_n4_points(self, building_id):
        points_info = []
        with DBConnection() as conn:
            sql = self.get_n4_points_sql()
            for rec in conn.select_dict(sql, [building_id]):
                pt_info = {
                    'point_id': rec['point_id'],
                    'point_path': rec['point_path'],
                    'point_name': rec['point_name'],
                    'asset_name': rec['asset_name'],
                    'asset_type_name': rec['asset_type_name'],
                    'tag_name': rec['tag_name'],
                }
                print(rec['point_path'])
                points_info.append(pt_info)

        return points_info

    
    def _manage_process(self, target_call, args=()):
        proc = Process(target=target_call, args=args)
        proc.start()
        proc.join(NIAGARA_READ_TIMEOUT_IN_SECS)
        if proc.is_alive():
            print("Timeout, terminating process.")
            proc.terminate()
            raise Exception("Process timeout.")