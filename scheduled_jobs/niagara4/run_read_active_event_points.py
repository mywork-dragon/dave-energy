
from scheduled_jobs.niagara4.run import Run

class RunReadActiveEventPoints(Run):

    def get_n4_points_sql(self):
        return '''select pt.id as point_id, pt.path as point_path, pt.name as point_name, ast.name as asset_name,
                    at.name as asset_type_name, pt.tag as tag_name
                from asset ast
                    INNER JOIN point pt ON ast.id = pt.asset_id
                    INNER JOIN asset_type at ON ast.asset_type_id = at.id
                    INNER JOIN dispatch dsp ON dsp.building_id = ast.building_id
                where ast.building_id = %s
                and at.name = 'HVAC'
                and pt.tag in ('DEFAULT_SETPOINT', 'EVENT_SETPOINT', 'METER_EXPORT')
                and dsp.end_date > NOW()
                '''

if __name__ == '__main__':
    run_every = RunReadActiveEventPoints()
    run_every.copy_n4_values()