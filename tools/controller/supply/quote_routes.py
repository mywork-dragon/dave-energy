import traceback

from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_energy_curves_connection import DBEnergyCurvesConnection
from controller.common_routes import login_required
from config import logger


@app.route("/tools/supply/get_quote", methods=["GET"])
@login_required
def get_quote():
    logger.info("Inside get_quote")
    customer_id = request.args.get("customer_id")

    resp = {}
    with DBEnergyCurvesConnection() as conn:
        sql = 'select quote from goliath_quote where customer_id = %s'
        resp['quote'] = conn.select_dict(sql, [customer_id])
    
    return jsonify(resp)


@app.route("/tools/supply/goliath_customer_id_and_name", methods=["GET"])
@login_required
def goliath_customer_id_and_name():
    logger.info("Inside goliath_customer_id_and_name")

    resp = {}
    customers = []
    with DBEnergyCurvesConnection() as conn:
        sql = 'select id, name from customer'
        for rec in conn.select_dict(sql):
            customer = {"id": rec["id"], "name": rec["name"]}
            customers.append(customer)
    
    resp["customers"] = customers
    return jsonify(resp)