
import traceback

from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger

@app.route("/tools/get_n4_credential", methods=["GET"])
@login_required
def get_n4_credential():
    building_id = request.args.get('building_id')
    logger.info('Inside get_n4_credential. Reading credential for {}'.format(building_id))
    resp = {}
    with DBConnection() as conn:
        sql = 'select id, ip_address, port, username, password from n4_credential where building_id = %s'
        recs = conn.select_dict(sql, [building_id])
        if recs:
            credential = {
                'id': recs[0]['id'],
                'ip_address': recs[0]['ip_address'],
                'port': recs[0]['port'],
                'username': recs[0]['username'],
                'password': recs[0]['password'],
            }
            resp['credential'] = credential

    return jsonify(resp)


@app.route("/tools/save_n4_credential", methods=["POST"])
@login_required
def save_n4_credential():
    building_id = request.form.get('add_credential_building_id')
    ip_address = request.form.get('add_ip_address')
    port = request.form.get('add_port')
    username = request.form.get('add_username')
    password = request.form.get('add_password')
    logger.info('Adding N4 Credential, building id: {}'.format(building_id))

    with DBConnection() as conn:
        sql = 'select * from n4_credential where building_id = %s'
        recs = conn.select_dict(sql, [building_id])
        if recs:
            return 'N4 Credential exists for this building, please delete it first.'

        sql = '''insert into n4_credential
            (created_at, building_id, ip_address, port, username, password)
            values
            (NOW(), %s, %s, %s, %s, %s)
            '''
        conn.execute(sql, [building_id, ip_address, port, username, password])

    return 'N4 credential added successfully.'


@app.route("/tools/delete_n4_credential", methods=["POST"])
@login_required
def delete_n4_credential():
    n4_credential_id = request.form.get('n4_credential_id')
    logger.info('Deleting N4 credential: {}'.format(n4_credential_id))

    try:
        with DBConnection() as conn:
            sql = 'delete from n4_credential where id = %s'
            conn.execute(sql, [n4_credential_id])
    except Exception as exp:
        traceback.print_exc()
        logger.error('Error while deleting:', exp)
        return 'Error, could not delete, please contact Engineering: {}'.format(traceback.format_exc())

    return 'N4 Credential deleted successfully.'
