
import traceback

from flask import Flask, render_template
from flask import request
from flask import jsonify
from sqlalchemy import func

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger
from models.unit import Unit


@app.route("/tools/get_bills", methods=["GET"])
@login_required
def get_bills():
    building_id = request.args.get('building_id')

    resp = {}
    with DBConnection() as conn:
        bills = []
        sql = 'select id, from_dt, to_dt, usage, unit_id, bill_amount_cents from bill_history where building_id = %s'
        for rec in conn.select_dict(sql, [building_id]):
            bill_type = '-'
            if rec['unit_id']:
                unit = Unit.query.filter_by(id=rec['unit_id']).first()
                bill_type = unit.description
            usage = '-'
            if rec['usage']:
                usage = rec['usage']

            bill = {
                'id': rec['id'],
                'from_dt': rec['from_dt'].strftime('%b %d, %Y'),
                'to_dt': rec['to_dt'].strftime('%b %d, %Y'),
                'usage': usage,
                'bill_type': bill_type,
                'bill_amount': round(int(rec['bill_amount_cents']) / 100, 2),
            }
            bills.append(bill)
        resp['bills'] = bills

    return jsonify(resp)


@app.route("/tools/add_bill", methods=["POST"])
@login_required
def add_bill():
    building_id = request.form.get('add_bill_building_id')
    from_dt = request.form.get('add_bill_from_dt')
    to_dt = request.form.get('add_bill_to_dt')
    usage = request.form.get('add_bill_usage')
    usage = float(usage) if usage else None
    bill_type = request.form.get('add_bill_type')
    amount = float(request.form.get('add_bill_amount'))
    logger.info('Adding bill for building id: {}, from: {}, to: {}, usage: {}, type: {}, amount{}'.format(
        building_id, from_dt, to_dt, usage, bill_type, amount
    ))

    with DBConnection() as conn:
        unit_id = None
        if bill_type != 'electric':
            unit = Unit.query.filter(Unit.description.ilike(bill_type)).first()
            unit_id = unit.id

        sql = '''insert into bill_history (building_id, from_dt, to_dt, usage, unit_id, bill_amount_cents, created_at)
            values (%s, %s, %s, %s, %s, %s, NOW())
            '''
        conn.execute(sql, [building_id, from_dt, to_dt, usage, unit_id, int(amount * 100)])

    return 'Bill added successfully.'


@app.route("/tools/delete_bill", methods=["POST"])
@login_required
def delete_bill():
    bill_id = request.form.get('bill_id')
    logger.info('Deleting bill id: {}'.format(bill_id))

    try:
        with DBConnection() as conn:
            sql = 'delete from bill_history where id = %s'
            conn.execute(sql, [bill_id])
    except Exception as exp:
        traceback.print_exc()
        logger.error('Error while deleting:', exp)
        return 'Error, could not delete, please contact Engineering: {}'.format(traceback.format_exc())

    return 'Point deleted successfully.'