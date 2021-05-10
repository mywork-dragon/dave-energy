from datetime import datetime, timedelta

from typing import Any, Dict, Optional, Tuple, List
from flask import json, jsonify, request
from werkzeug import Response

from app import app
from controller.common_routes import (
    login_required,
)
from controller.analytics_building_engineer import (asset_details, 
    export_details, solar_details)
from controller.analytics_building_engineer.consumption_details import ConsumptionDetails
from controller.analytics_building_engineer.demand_details import DemandDetails
from common import utils
from controller.common_routes import login_required
from config import logger
from models.building import Building


@app.route("/building/<int:building_id>/analytics_boxes", methods=["GET"])
@login_required
def analytics_boxes(building_id: int) -> Tuple[Response, int]:
    asset_names = asset_details.get_asset_boxes_by_building(building_id)
    return jsonify(asset_names), 200


@app.route("/building/<int:building_id>/annual-energy-consumption", methods=["GET"])
@login_required
def annual_energy_consumption(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year = int(request.args.get("year"))

    cons_details = ConsumptionDetails()
    consumption_by_month = cons_details.get_energy_consumption_by_month(building, year)
    return jsonify(consumption_by_month), 200


@app.route("/building/<int:building_id>/annual-energy-demand", methods=["GET"])
@login_required
def annual_energy_demand(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year = int(request.args.get("year"))

    demand_details = DemandDetails()
    demand_by_month = demand_details.get_annual_energy_demand(building, year)
    return jsonify(demand_by_month), 200


@app.route("/building/<int:building_id>/annual-solar-generation", methods=["GET"])
@login_required
def annual_solar_generation(building_id: int) -> Tuple[Response, int]:
    year = int(request.args.get("year"))  # type: ignore
    solar_generation_by_month = solar_details.solar_generation_by_billing_cycle(
        building_id, year
    )
    return jsonify(solar_generation_by_month), 200

@app.route("/building/<int:building_id>/annual-export", methods=["GET"])
@login_required
def annual_export(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year = int(request.args.get("year"))  # type: ignore
    export_by_month = export_details.get_export_by_month(building, year)
    return jsonify(export_by_month), 200


@app.route("/assets/<int:building_id>/asset_names", methods=["GET"])
@login_required
def asset_names(building_id: int) -> Tuple[Response, int]:
    asset_names = ["HVAC"]
    return jsonify(asset_names), 200


@app.route("/assets/<int:building_id>/dropdown_values", methods=["GET"])
@login_required
def asset_dropdown_values(building_id: int) -> Tuple[Response, int]:
    assets_dropdown_data = asset_details.asset_dropdowns(building_id)
    return (
        Response(json.dumps(assets_dropdown_data), headers={"X-No-Convert": "true"}),
        200,
    )


@app.route("/assets/asset-chart-values", methods=["GET"])
@login_required
def asset_chart_values() -> Tuple[Response, int]:
    building_id = int(request.args.get("building_id"))  # type: ignore
    point_id = int(request.args.get("point_id"))  # type: ignore
    from_time = utils.get_fe_strtime_to_datetime(request.args.get("from_time"))  # type: ignore
    from_time = datetime(from_time.year, from_time.month, from_time.day, 0, 0, 0)
    end_time = from_time + timedelta(days=1)

    asset_chart_values = asset_details.chart_values(
        building_id, point_id, from_time, end_time
    )
    return jsonify(asset_chart_values), 200


@app.route("/building/<int:building_id>/energy-consumption/compare", methods=["GET"])
@login_required
def energy_consumption_comparison(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year1 = int(request.args.get("year1"))
    year2 = int(request.args.get("year2"))
    compare_consumption = _compare_energy_consumption(building, year1, year2)
    return jsonify(compare_consumption), 200


@app.route("/building/<int:building_id>/energy-demand/compare", methods=["GET"])
@login_required
def energy_demand_comparison(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year1 = int(request.args.get("year1"))
    year2 = int(request.args.get("year2"))
    compare_demand = _compare_energy_demand(building, year1, year2)
    return jsonify(compare_demand), 200


@app.route("/building/<int:building_id>/solar-generation/compare", methods=["GET"])
@login_required
def solar_generation_comparison(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year1 = int(request.args.get("year1"))
    year2 = int(request.args.get("year2"))
    compare_solar = _compare_solar_generation(building, year1, year2)
    return jsonify(compare_solar), 200


@app.route("/building/<int:building_id>/export/compare", methods=["GET"])
@login_required
def export_comparison(building_id: int) -> Tuple[Response, int]:
    building = Building.query.filter_by(id=building_id).first()
    year1 = int(request.args.get("year1"))
    year2 = int(request.args.get("year2"))
    compare_export = _compare_export(building, year1, year2)
    return jsonify(compare_export), 200


def _compare_solar_generation(building: Building, year1: int, year2: int) -> Dict[int, Any]:
    bc_from_day = building.billing_cycles[0].from_day
    year1_dem = solar_details.get_annual_solar_generation(building.id, bc_from_day, year1)
    year2_dem = solar_details.get_annual_solar_generation(building.id, bc_from_day, year2)

    comparison = {
        str(year1): {month["month_number"]: month["quantity"] for month in year1_dem},
        str(year2): {month["month_number"]: month["quantity"] for month in year2_dem},
        "unit": "kW"
    }

    return comparison


def _compare_energy_consumption(
    building: Building, year1: int, year2: int
) -> Dict[int, Any]:
    cons_details = ConsumptionDetails()
    year1_cons = cons_details.get_energy_consumption_by_month(building, year1)
    year2_cons = cons_details.get_energy_consumption_by_month(building, year2)

    comparison = {
        str(year1): {month["month_number"]: month["quantity"] for month in year1_cons},
        str(year2): {month["month_number"]: month["quantity"] for month in year2_cons},
        "unit": "kWh"
    }

    return comparison


def _compare_energy_demand(building: Building, year1: int, year2: int) -> Dict[int, Any]:
    print(year1, year2)
    demand_details = DemandDetails()
    year1_dem = demand_details.get_annual_energy_demand(building, year1)
    year2_dem = demand_details.get_annual_energy_demand(building, year2)

    comparison = {
        str(year1): {month["month_number"]: month["quantity"] for month in year1_dem},
        str(year2): {month["month_number"]: month["quantity"] for month in year2_dem},
        "unit": "kW"
    }

    return comparison


def _compare_export(building: Building, year1: int, year2: int) -> Dict[int, Any]:
    year1_cons = export_details.get_export_by_month(building, year1)
    year2_cons = export_details.get_export_by_month(building, year2)

    comparison = {
        str(year1): {month["month_number"]: month["quantity"] for month in year1_cons},
        str(year2): {month["month_number"]: month["quantity"] for month in year2_cons},
        "unit": "kW"
    }

    return comparison