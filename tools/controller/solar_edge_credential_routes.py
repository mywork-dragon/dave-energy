from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger


@app.route("/tools/get_solar_edge_credentials", methods=["GET"])
@login_required
def get_solar_edge_credentials():
    building_id = request.args.get('building_id')
    logger.info('Inside get_solar_edge_credentials. Reading credential for {}'.format(building_id))
    resp = {}
    with DBConnection() as conn:
        sql = '''select sec.id, sec.site_id, sec.api_key, ast.name as device_name
            from solar_edge_credential sec
                INNER JOIN asset ast ON sec.asset_id = ast.id
            where ast.building_id = %s
            '''
        credentials = []
        for rec in conn.select_dict(sql, [building_id]):
            credential = {
                'id': rec['id'],
                'device_name': rec['device_name'],
                'site_id': rec['site_id'],
                'api_key': rec['api_key'],
            }
            credentials.append(credential)
        resp['credentials'] = credentials

    return jsonify(resp)


@app.route("/tools/save_solar_edge_credential", methods=["POST"])
@login_required
def save_solar_edge_credential():
    asset_id = request.form.get('add_credential_device_id')
    site_id = request.form.get('add_site_id')
    api_key = request.form.get('add_api_key')
    logger.info('Adding Solar Edge Credential, asset id: {}'.format(asset_id))

    with DBConnection() as conn:
        sql = 'select * from solar_edge_credential where asset_id = %s'
        recs = conn.select_dict(sql, [asset_id])
        if recs:
            return 'Solar Edge Credential exists for this asset, please delete it first.'

        sql = '''insert into solar_edge_credential
            (created_at, asset_id, site_id, api_key)
            values
            (NOW(), %s, %s, %s)
            '''
        conn.execute(sql, [asset_id, site_id, api_key])

    return 'Solar Edge credential added successfully.'


@app.route("/tools/delete_solar_edge_credential", methods=["POST"])
@login_required
def delete_solar_edge_credential():
    solar_edge_credential_id = request.form.get('solar_edge_credential_id')
    logger.info('Deleting Solar Edge credential: {}'.format(solar_edge_credential_id))

    try:
        with DBConnection() as conn:
            sql = 'delete from solar_edge_credential where id = %s'
            conn.execute(sql, [solar_edge_credential_id])

    except Exception as exp:
        logger.error('Error while deleting:', exp)
        return 'Error, could not delete, please contact Engineering: {}'.format(traceback.format_exc())

    return 'Solar Edge Credential deleted successfully.'