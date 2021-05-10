
from scheduled_jobs.niagara4.run import Run

class RunEvery30Min(Run):

     def get_n4_points_sql(self):
        return '''select pt.id as point_id, pt.path as point_path, pt.name as point_name, ast.name as asset_name
            from asset ast
                INNER JOIN point pt ON ast.id = pt.asset_id
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
            where ast.building_id = %s
            and pt.path not like '%%EventType'
            and pt.path not like '%%EventEn'
            '''

if __name__ == '__main__':
    run_every = RunEvery30Min()
    run_every.copy_n4_values()