
import traceback

from flask import Flask, render_template
from flask import request
from flask import jsonify
import multiprocessing
from multiprocessing.connection import Connection
from pyhaystack.client.niagara import Niagara4HaystackSession
from pyhaystack.exception import HaystackError
from typing import Dict, Tuple


from app import app
from common.constants import N4_TIMEOUT
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger
from models.point import Point
from models.asset import Asset


@app.route("/tools/get_point_details", methods=["GET"])
@login_required
def get_point_details():
    resp = {}
    logger.info('Inside get_point_details')
    building_id = request.args.get('building_id')
    point_path = request.args.get('point_path')

    resp = {}
    with DBConnection() as conn:
        sql = '''select pt.id as point_id, pt.name as point_name, dev.name as device_name
            from points pt
                INNER JOIN devices dev ON pt.device_id = dev.id
            where dev.building_id = %s
            and pt.path = %s
            '''
        recs = conn.select_dict(sql, [building_id, point_path])
        if recs:
            resp['point_details'] = {
                'point_id': recs[0]['point_id'],
                'point_name': recs[0]['point_name'],
                'device_name': recs[0]['device_name']
            }

            sql = 'select * from n4_credential where building_id = %s'
            recs = conn.select_dict(sql, [building_id])
            resp['point_details']['n4_credential_configured'] = 'No'
            if recs:
                resp['point_details']['n4_credential_configured'] = 'Yes'

    return jsonify(resp)

@app.route("/tools/get_points_for_testing", methods=["GET"])
@login_required
def get_points_for_testing():
    logger.info('Inside get_points_for_testing')
    asset_id = request.args.get('asset_id')
    device_id = request.args.get('device_id')

    resp = {}
    with DBConnection() as conn:
        sql = 'select id, name, path from point where asset_id = %s'
        args = [asset_id]
        if device_id:
            sql = 'select id, name, path from point where asset_id = %s and device_id = %s'
            args.append(device_id)

        points = []
        for rec in conn.select_dict(sql, args):
            point = {}
            point['point_id'] = rec['id']
            point['point_name'] = rec['name']
            point['point_path'] = rec['path']
            points.append(point)

        resp['points'] = points

    return jsonify(resp)


@app.route("/tools/test_point_read", methods=["GET"])
@login_required
def test_point_read():
    logger.info('Inside test_point_read')
    point_path = request.args.get('point_path')

    with DBConnection() as conn:
        sql = '''select n4c.ip_address, n4c.port, n4c.username, n4c.password
            from n4_credential n4c
                inner join building bld on n4c.building_id = bld.id
                inner join asset ast on ast.building_id = bld.id
                inner join point pt on pt.asset_id = ast.id
            where pt.path = %s
            '''
        recs = conn.select_dict(sql, [point_path])
        if recs:
            _, resp = test_n4_point_read(recs[0]['ip_address'], recs[0]['port'],
                                         recs[0]['username'], recs[0]['password'],
                                         point_path)
            return jsonify(resp)
        else:
            return jsonify({"message": 'N4 credentials have not been created for the building: {}'.format(building_id)})


def test_n4_point_read(ip_address: str, port: int, username: str, passwd: str, point_path:str) -> Tuple[Dict[str, str], int]:
    timeout_in_secs = 20
    session = Niagara4HaystackSession(
        uri='https://{}:{}'.format(ip_address, port),
        username=username,
        password=passwd,
        http_args=dict(tls_verify=False, debug=True),
        pint=False,
    )
    parent_conn, child_conn = multiprocessing.Pipe()
    process = multiprocessing.Process(target=_count_values_from_n4, args=(session, point_path, child_conn), name="count_values_process")
    process.start()
    process.join(timeout=timeout_in_secs)
    if process.is_alive():
        process.terminate()
        return False, {"message": f'Read from Niagara was timedout after {timeout_in_secs}secs, please ask Automation team for help.'}
    process_return = parent_conn.recv()
    if isinstance(process_return, int):
        return True, {"message": 'Read {} values for today for point path: {}.'.format(process_return, point_path)}
    else:
        error, traceback_str = process_return
        process.terminate()
        return False, {"message": 'Error while reading from {}: {}'.format(point_path, traceback_str)}


def _count_values_from_n4(session:Niagara4HaystackSession, point_path:str, conn:Connection) -> None:
    try:
        op = session.his_read(point_path, rng='today')
        op.wait()
        cnt = 0
        for row in op.result._row:
            cnt += 1
        conn.send(cnt)
    except Exception as e:
        conn.send((e, traceback.format_exc()))
