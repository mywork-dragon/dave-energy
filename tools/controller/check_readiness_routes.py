
from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger
from models.building import Building
from scheduled_jobs.niagara4.events import events_config
from tools.controller.point_checker_routes import test_n4_point_read


@app.route("/tools/go_live_ready", methods=["GET"])
@login_required
def go_live_ready():
    building_id = request.args.get("building_id")

    checks = []
    # Has Niagara credentials
    with DBConnection() as conn:
        sql = 'select * from n4_credential where building_id = %s'
        recs = conn.select_dict(sql, [building_id])
        if not recs:
            resp = {'message': 'Building is missing Niagara credentials, please add them and check again.'}
            return jsonify(resp)
    checks.append('<p>Niagara credentials configured.</p>')

    # Has Electric Meters
    with DBConnection() as conn:
        sql = '''select *
            from asset ast
                inner join asset_type ast_typ on ast.asset_type_id = ast_typ.id
            where building_id = %s
            and ast_typ.name = 'Meter'
            and ast.energy_type = 'electric'
            '''
        recs = conn.select_dict(sql, [building_id])
        if not recs:
            resp = {'message': 'Building has no electric meter assets configured. Please add and check again.'}
            return jsonify(resp)
    checks.append('<p>Electric meters have been configured.</p>')


    # All Electric Meters have points with METER tag
    with DBConnection() as conn:
        sql = '''select *
            from asset ast
                inner join asset_type ast_typ on ast.asset_type_id = ast_typ.id
            where building_id = %s
            and ast_typ.name = 'Meter'
            and ast.energy_type = 'electric'
            and not exists (select * from point pt where pt.asset_id = ast.id and pt.tag = 'METER')
            '''
        recs = conn.select_dict(sql, [building_id])
        if recs:
            resp = {'message': 'There is atleast one electric meter asset configured for this building, which has not point tagged as METER. Please add and check again.'}
            return jsonify(resp)
    checks.append('<p>Electric meters have points with METER tag configured.</p>')

    # Has HVAC with all the points with right tags
    with DBConnection() as conn:
        for pt_tag in [events_config.POINT_EVENT_ENABLE_TAG, events_config.POINT_EVENT_TYPE_TAG, 
                       'DEFAULT_SETPOINT', 'EVENT_SETPOINT']:
            sql = '''select *
                from asset ast
                    inner join asset_type ast_typ on ast.asset_type_id = ast_typ.id
                    inner join point pt on pt.asset_id = ast.id
                where building_id = %s
                and ast_typ.name = 'HVAC'
                and ast.energy_type = 'electric'
                and pt.tag = %s
                '''
            recs = conn.select_dict(sql, [building_id, pt_tag])
            if not recs:
                resp = {'message': 'HVAC configured does not have point tagged as {}. Please add and try again'.format(pt_tag)}
                return jsonify(resp)
    checks.append('<p>HVAC has points needed for event scheduler configured.</p>')

    # Check if N4 read works
    did_pass, message = _test_n4_read(building_id)
    checks.append('<p>{}</p>'.format(message))

    if did_pass:
        checks.append('<p><b>Building is ready to go live, please inform engineering.</b></p>')
    
    resp = {'message': ''.join(checks)}
    return jsonify(resp)


def _test_n4_read(building_id):
    with DBConnection() as conn:
        sql = 'select ip_address, port, username, password from n4_credential where building_id = %s'
        recs = conn.select_dict(sql, [building_id])
        ip_address, port, username, password = recs[0]['ip_address'], recs[0]['port'], recs[0]['username'], recs[0]['password']

        sql = '''select pt.path
            from asset ast
                inner join asset_type ast_typ on ast.asset_type_id = ast_typ.id
                inner join point pt on pt.asset_id = ast.id
            where building_id = %s
            and ast_typ.name = 'Meter'
            and ast.energy_type = 'electric'
             and pt.tag = 'METER'
            '''
        point_path = conn.select_dict(sql, [building_id])[0]['path']
        
        did_pass, message = test_n4_point_read(ip_address, port, username, password, point_path)
        return  did_pass, message["message"]


if __name__ == "__main__":
    go_live_ready()