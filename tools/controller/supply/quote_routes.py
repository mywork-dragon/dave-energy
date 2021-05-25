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


@app.route("/tools/supply/customer_lead_id_and_name", methods=["GET"])
@login_required
def customer_lead_id_and_name():
    logger.info("Inside customer_lead_id_and_name")
    customer_id = request.args.get("customer_id")

    resp = {}
    leads = []
    with DBEnergyCurvesConnection() as conn:
        sql = 'select id, name from customer_lead where customer_id = %s'
        for rec in conn.select_dict(sql, [customer_id]):
            lead = {"id": rec["id"], "name": rec["name"]}
            leads.append(lead)
    
    resp["leads"] = leads
    return jsonify(resp)


@app.route("/tools/supply/search_quotes", methods=["GET"])
@login_required
def search_quotes():
    logger.info("Inside search_quotes")
    customer_id = request.args.get("customer_id", None)
    customer_lead_id = request.args.get("customer_lead_id", None)

    resp = {}
    quotes = []
    with DBEnergyCurvesConnection() as conn:
        sql = None
        args = []
        if customer_id:
            sql = '''select gq.id, cust.name as cust_name, cl.name as lead_name, gq.utc_created
                from goliath_quote gq
                    inner join customer cust on gq.customer_id = cust.id
                    inner join customer_lead cl on gq.customer_lead_id = cl.id
                where customer_id = %s
                and customer_lead_id = %s
                order by gq.utc_created desc
                limit 100
                '''
            args = [customer_id, customer_lead_id]
        else:
            sql = '''select gq.id, cust.name as cust_name, cl.name as lead_name, gq.utc_created
                from goliath_quote gq
                    inner join customer cust on gq.customer_id = cust.id
                    inner join customer_lead cl on gq.customer_lead_id = cl.id
                order by gq.utc_created desc
                limit 100
                '''

        for rec in conn.select_dict(sql, args):
            quote = {
                "id": rec["id"],
                "cust_name": rec["cust_name"],
                "lead_name": rec["lead_name"],
                "created_at": rec["utc_created"]
            }
            quotes.append(quote)
    
    resp["quotes"] = quotes
    return jsonify(resp)