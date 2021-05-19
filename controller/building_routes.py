# type: ignore
from typing import Tuple
from datetime import datetime, timedelta

from flask import json, jsonify, request, Response
from werkzeug import Response
from dateutil.relativedelta import relativedelta

from app import app
from common.exceptions import (
    AuthenticationError,
    ResourceConflictError,
    ResourceNotFound,
)
from flask import session

from common.utils import time_to_utc, get_event_scheduler_order
from controller.common_routes import (
    login_required
)
from controller.analytics_building_engineer import asset_details, solar_details
from serializers.user_serializers import (
    energy_annual_data_request_schema
)
from services.billing_service import (
    get_billing_cycle,
    get_billing_information,
    get_greenhouse_gas_emissions,
)
from services.building_service import (
    get_building_energy_ratings,
)
from services.energy_service import get_energy_consumption_data
from models.building import Building
from models.user import User
from flask_login import current_user
from common import constants, slack, utils
from config import logger
from controller.control_room import event_details
from controller.control_room import solar_details


@app.route("/buildings", methods=["GET"])
@login_required
def get_buildings() -> Tuple[Response, int]:
    """
    Returns all the buildings for the current user.
    """
    user = User.query.filter_by(id=current_user.id).first()
    # Return only active buildings
    active_buildings = [bld for bld in user.company.buildings if bld.status == 1]
    active_buildings.sort(key=lambda bld : bld.address)
    buildings = []
    for bld in active_buildings:
        buildings.append({
            "id": bld.id,
            "address": bld.address
        })

    return jsonify(buildings), 200


@app.route("/get-display-reports", methods=["GET"])
@login_required
def get_display_reports():
    user = User.query.filter_by(id=current_user.id).first()
    resp = {}
    resp['reports_to_display'] = [] 
    if user.user_role == 3:
        if user.company.name == "JRS":
            resp['reports_to_display'] = [
                "Control Room",
                "Analytics-Management",
                "Sustainability"
            ]
        else:
            resp['reports_to_display'] = ["Analytics-Management"]
    else:
        resp['reports_to_display'] = [
            "Control Room",
            "Analytics-",
            "Sustainability"
        ]
    
    return jsonify(resp), 200


@app.route("/building/<int:building_id>/energy-demand", methods=["GET"])
@login_required
def get_building_energy_demand_data(building_id: int) -> Tuple[Response, int]:
    from_time = utils.get_fe_strtime_to_datetime(request.args.get("from_time"))
    to_time = from_time + timedelta(hours=24)
    energy_type = request.args.get("energy_type")

    billing_peak = utils.get_billing_peak(building_id, from_time)
    if not billing_peak:
        slack.send_alert(
            "Billing peak not present for building id: {}".format(building_id)
        )
        logger.warning(
            "Billing peak not present for building id: {}".format(building_id)
        )

    res = get_energy_consumption_data(
        requested_energy_type=energy_type,
        from_time=from_time,
        to_time=to_time,
        building_id=building_id,
    )
    res["target"] = billing_peak

    return jsonify(res), 200


@app.route("/building/<int:building_id>/event-scheduler", methods=["GET"])
@login_required
def building_event_scheduler(building_id: int) -> Tuple[Response, int]:
    start_time = utils.get_fe_strtime_to_datetime(request.args.get("from_time"))
    event_lst = event_details.get_event_schedule_lst(building_id, start_time)

    return jsonify(event_lst), 200


@app.route("/revert_point", methods=["POST"])
@login_required
def revert_point() -> Tuple[Response, int]:
    building_id = int(request.args.get("building_id"))
    point_id = int(request.args.get("revert_point_id"))
    dispatch_id = int(request.args.get("dispatch_id"))
    try:
        event_details.revert_controller_action(
            building_id, point_id, dispatch_id, current_user.id
        )
    except Exception as exc:
        logger.error(
            "Error while writing to Niagara for reverting event for point id: {}".format(
                point_id
            ),
            exc,
        )
        slack.send_alert(
            "Error while writing to Niagara for reverting event for point id: {}".format(
                point_id
            )
        )

    return jsonify({"message": "success"}), 200


@app.route("/building/<int:building_id>/billing-cycle", methods=["GET"])
@login_required
def get_current_billing_cycle(building_id: int) -> Tuple[Response, int]:
    from_time = request.args.get("from_time")
    if from_time:
        # convert FE time (EST) to UTC
        from_time = time_to_utc(from_time)
    return jsonify(get_billing_cycle(building_id, from_time)), 200


@app.route("/building/<int:building_id>/billing-information", methods=["GET"])
@login_required
def billing_information(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    billing_information = get_billing_information(building)
    return jsonify(billing_information), 200


@app.route("/building/<int:building_id>/solar-totals", methods=["GET"])
@login_required
def solar_totals(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    solar_totals = solar_details.get_solar_totals(building)
    return jsonify(solar_totals), 200


@app.route("/building/<int:building_id>/greenhouse-gas-emissions", methods=["GET"])
@login_required
def greenhouse_gas_emissions(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    schema = energy_annual_data_request_schema.load(request.args)
    gas_emissions = get_greenhouse_gas_emissions(building, schema["year"])
    return jsonify(gas_emissions), 200


@app.route("/building/<int:building_id>/energy-star-rating", methods=["GET"])
@login_required
def get_building_energy_star_rating(building_id: int) -> Tuple[Response, int]:
    year = request.args.get("year")
    year = year if year and len(year) == 4 else datetime.today().year
    equipments = get_building_energy_ratings(building_id=building_id, year=year)
    return jsonify(equipments), 200