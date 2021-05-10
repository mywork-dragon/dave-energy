from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from config import logger
from models.point import Point
from models.asset import Asset
from models.building import Building
from models.device import Device


@app.route("/tools/company_id_and_name", methods=["GET"])
@login_required
def company_id_and_name():
    resp = {}
    logger.info("Inside company_id_and_name")
    with DBConnection() as conn:
        sql = "select id, name from company order by name"
        companies = []
        for rec in conn.select_dict(sql):
            company = {"id": rec["id"], "name": rec["name"]}
            companies.append(company)
        resp["companies"] = companies

    return jsonify(resp)


@app.route("/tools/buildings_of_company", methods=["GET"])
@login_required
def buildings_of_company():
    company_id = request.args.get("company_id")
    logger.info(
        "Inside buildings_of_company. Reading buildings for {}".format(company_id)
    )
    resp = {}
    with DBConnection() as conn:
        sql = """select id, name, address, service_address, sq_footage, zipcode, occupancy, consumes_gas, consumes_steam
            from building where company_id = %s order by name"""
        buildings = []
        for rec in conn.select_dict(sql, [company_id]):
            building = {
                "id": rec["id"],
                "name": rec["name"],
                "address": rec["address"],
                "service_address": rec["service_address"],
                "zipcode": rec["zipcode"],
                "sq_footage": rec["sq_footage"],
                "occupancy": rec["occupancy"],
                "consumes_gas": rec["consumes_gas"],
                "consumes_steam": rec["consumes_steam"],
            }
            buildings.append(building)
        resp["buildings"] = buildings

    return jsonify(resp)


@app.route("/tools/get_building_attributes", methods=["GET"])
@login_required
def get_building_attributes():
    building_id = request.args.get("building_id")
    logger.info(
        "Inside get_building_attributes. Reading attributes for building {}".format(
            building_id
        )
    )
    building = Building.query.filter(Building.id == building_id).first()
    if not building:
        return "Could not find building with id {}".format(building_id), 404
    resp = {
        "name": building.name,
        "address": building.address,
        "zipcode": building.zipcode,
        "service_address": building.service_address,
        "address": building.address,
        "sq_footage": building.sq_footage,
        "occupancy": building.occupancy,
        "consumes_gas": building.consumes_gas,
        "consumes_steam": building.consumes_steam,
    }
    return jsonify(resp)


@app.route("/tools/assets_of_building", methods=["GET"])
@login_required
def assets_of_building():
    building_id = request.args.get("building_id")
    logger.info("Inside assets_of_building. Reading assets for {}".format(building_id))
    resp = {}
    with DBConnection() as conn:
        sql = """select ast.id, ast.name, ast.energy_type, at.name as asset_type_name
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
            where ast.building_id = %s order by ast.name
            """
        assets = []
        for rec in conn.select_dict(sql, [building_id]):
            asset = {
                "id": rec["id"],
                "name": rec["name"],
                "asset_type_name": rec["asset_type_name"],
                "energy_type": rec["energy_type"],
            }
            assets.append(asset)
        resp["assets"] = assets

    return jsonify(resp)


@app.route("/tools/solar_api_assets_of_building", methods=["GET"])
@login_required
def solar_api_assets_of_building():
    building_id = request.args.get("building_id")
    logger.info(
        "Inside solar_api_assets_of_building. Reading assets for {}".format(building_id)
    )
    resp = {}
    with DBConnection() as conn:
        sql = """select ast.id, ast.name, ast.energy_type, at.name as asset_type_name
            from asset ast
                INNER JOIN asset_type at ON ast.asset_type_id = at.id
            where ast.building_id = %s
            and at.name = 'Solar'
            order by ast.name
            """
        assets = []
        for rec in conn.select_dict(sql, [building_id]):
            asset = {
                "id": rec["id"],
                "name": rec["name"],
            }
            assets.append(asset)
        resp["assets"] = assets

    return jsonify(resp)


@app.route("/tools/devices_and_points_for_asset", methods=["GET"])
@login_required
def devices_and_points_for_asset():
    asset_id = request.args.get("asset_id")
    logger.info(
        "Inside devices_and_points_for_asset. Reading devices and points for {}".format(
            asset_id
        )
    )

    resp = {}
    resp["devices"] = _get_devices_for_asset(asset_id)
    resp["points"] = _get_points_for_asset(asset_id)
    return jsonify(resp)


@app.route("/tools/devices_of_asset", methods=["GET"])
@login_required
def devices_of_asset():
    asset_id = request.args.get("asset_id")
    logger.info("Inside devices_of_asset. Reading equipments for {}".format(asset_id))
    resp = {"devices": _get_devices_for_asset(asset_id)}

    return jsonify(resp)


def _get_devices_for_asset(asset_id):
    with DBConnection() as conn:
        sql = "select id, name from device where asset_id = %s order by name"
        devices = []
        for rec in conn.select_dict(sql, [asset_id]):
            device = {
                "id": rec["id"],
                "name": rec["name"],
            }
            devices.append(device)
        return devices


@app.route("/tools/get_device_attributes", methods=["GET"])
@login_required
def get_device_attributes():
    device_id = request.args.get("device_id")
    logger.info(
        "Inside get_device_attributes. Reading attributes for Device {}".format(
            device_id
        )
    )
    resp = {}
    device = Device.query.filter(Device.id == device_id).first()
    if not device:
        return "Could not find device with id {}".format(device_id), 404
    resp["name"] = device.name
    resp["asset_id"] = device.asset_id
    asset = Asset.query.filter_by(id=device.asset_id).first()
    resp["building_id"] = asset.building_id
    return jsonify(resp)


@app.route("/tools/points_of_asset", methods=["GET"])
@login_required
def points_of_asset():
    asset_id = request.args.get("asset_id")
    logger.info(
        "Inside points_of_asset. Reading points for asset_id {}".format(asset_id)
    )
    resp = {"points": _get_points_for_asset(asset_id)}

    return jsonify(resp)


def _get_points_for_asset(asset_id):
    with DBConnection() as conn:
        sql = """select pt.id, pt.name, pt.path, pt.tag, ut.symbol
            from point pt
                LEFT JOIN unit ut ON pt.unit_id = ut.id
            where asset_id = %s order by name
            """
        points = []
        for rec in conn.select_dict(sql, [asset_id]):
            point = {
                "id": rec["id"],
                "name": rec["name"],
                "path": rec["path"],
                "unit": "not_set",
                "tag": rec["tag"],
            }
            if rec["symbol"]:
                point["unit"] = rec["symbol"]
            points.append(point)

        return points


@app.route("/tools/get_asset_attributes", methods=["GET"])
@login_required
def get_asset_attributes():
    asset_id = request.args.get("asset_id")
    logger.info(
        "Inside get_asset_attributes. Reading attributes for asset {}".format(asset_id)
    )
    resp = {}
    asset = Asset.query.filter(Asset.id == asset_id).first()
    if not asset:
        return "Could not find asset with id {}".format(asset_id), 404
    resp["name"] = asset.name
    resp["building_id"] = asset.building_id
    resp["energy_type"] = asset.energy_type
    resp["asset_type_id"] = asset.asset_type_id
    return jsonify(resp)


@app.route("/tools/points_of_devices", methods=["GET"])
@login_required
def points_of_devices():
    device_id = request.args.get("device_id")
    logger.info("Inside points_of_devices. Reading points for {}".format(device_id))
    resp = {}
    with DBConnection() as conn:
        sql = """select pt.id, pt.name, pt.path, ut.symbol as unit_symbol,
                        pt.tag
            from point pt
                LEFT JOIN unit ut ON pt.unit_id = ut.id
            where pt.device_id = %s order by pt.name
            """
        points = []
        for rec in conn.select_dict(sql, [device_id]):
            point = {
                "id": rec["id"],
                "name": rec["name"],
                "path": rec["path"],
                "unit": "not_set",
                "tag": rec["tag"],
            }
            if rec["unit_symbol"]:
                point["unit"] = rec["unit_symbol"]
            points.append(point)
        resp["points"] = points

    return jsonify(resp)


@app.route("/tools/units_for_point", methods=["GET"])
@login_required
def units_for_point():
    logger.info("Inside units_for_point.")
    resp = {}
    with DBConnection() as conn:
        sql = "select id, symbol from unit"
        units = []
        for rec in conn.select_dict(sql):
            unit = {
                "id": rec["id"],
                "symbol": rec["symbol"],
            }
            units.append(unit)
        resp["units"] = units

    return jsonify(resp)


@app.route("/tools/asset_types", methods=["GET"])
@login_required
def asset_types():
    logger.info("Inside asset_types.")
    resp = {}
    with DBConnection() as conn:
        sql = "select id, name from asset_type"
        asset_types = []
        for rec in conn.select_dict(sql):
            asset_type = {
                "id": rec["id"],
                "name": rec["name"],
            }
            asset_types.append(asset_type)
        resp["asset_types"] = asset_types

    return jsonify(resp)
