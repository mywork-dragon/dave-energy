
import traceback

from config import logger
from scheduled_jobs.niagara4.run import Run
from scheduled_jobs.niagara4.n4_events_handler import N4EventHandler
from common import slack

class RunReadMeterPoints(Run):

    def get_n4_points_sql(self):
        return '''select pt.id as point_id, pt.path as point_path, pt.name as point_name, ast.name as asset_name,
                    at.name as asset_type_name, pt.tag as tag_name
                from asset ast
                    INNER JOIN point pt ON ast.id = pt.asset_id
                    INNER JOIN asset_type at ON ast.asset_type_id = at.id
                where ast.building_id = %s
                and at.name in ('HVAC', 'Meter')
                and pt.tag in ('METER', 'METER_EXPORT')
                '''


if __name__ == '__main__':
    run_every = RunReadMeterPoints()
    run_every.copy_n4_values()