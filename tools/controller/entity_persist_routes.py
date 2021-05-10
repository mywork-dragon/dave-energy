import traceback

from flask import Flask, render_template
from flask import request
from flask import jsonify

from app import app
from data.db_connection import DBConnection
from controller.common_routes import login_required
from models.asset import Asset
from models.building import Building
from models.device import Device
from config import logger
from models.shared import db


# tools/save_building?company_id=5&name=building_name&address=123mainst&sq_footage=100&zipcode=123456&occupancy=1000&consumes_gas=true&consumes_steam=false


@app.route("/tools/save_building", methods=["POST"])
@login_required
def save_building():
    building_id = request.form.get("building_id")
    building_id = int(building_id) if building_id else None
    company_id = request.form.get("company_id")
    name = request.form.get("building_name")
    address = request.form.get("address")
    service_address = request.form.get("service_address")
    sq_footage = request.form.get("sq_footage")
    zipcode = request.form.get("zipcode")
    occupancy = request.form.get("occupancy")
    consumes_gas = request.form.get("consumes_gas")
    consumes_steam = request.form.get("consumes_steam")
    logger.info(
        "Saving building, company id: {}, name: {}, address: {}, service_address: {}, sq_footage: {}, zipcode: {}, "
        + "occupancy: {}, consumes_gas: {}, consumes_steam: {}".format(
            company_id,
            name,
            address,
            service_address,
            sq_footage,
            zipcode,
            occupancy,
            consumes_gas,
            consumes_steam,
        )
    )

    with DBConnection() as conn:
        sql = "select * from building where company_id = %s and lower(name) = %s"
        recs = conn.select_dict(sql, [company_id, name.lower()])
        if recs and int(recs[0]["id"]) != building_id:
            return "Building name exists, needs to be unique.", 409

        sql = "select * from building where lower(address) = %s"
        recs = conn.select_dict(sql, [address.lower()])
        if recs and int(recs[0]["id"]) != building_id:
            return "Building address exists, needs to be unique.", 409

        if service_address:
            sql = "select * from building where lower(service_address) = %s"
            recs = conn.select_dict(sql, [service_address.lower()])
            if recs and int(recs[0]["id"]) != building_id:
                return "Building service address exists, needs to be unique.", 409

    building = Building()
    if building_id:
        building = Building.query.filter_by(id=building_id).first()
        if not building:
            return "Building id {} could not be found".format(building_id), 404

    building.company_id = int(company_id)
    building.name = name
    building.address = address
    building.zipcode = int(zipcode) if zipcode else None
    building.service_address = service_address if service_address else None
    building.sq_footage = int(sq_footage) if sq_footage else None
    building.occupancy = int(occupancy) if occupancy else None
    building.consumes_gas = bool(consumes_gas)
    building.consumes_steam = bool(consumes_steam)

    if building_id:
        db.session.commit()
        return "Building updated successfully", 200
    else:
        db.session.add(building)
        db.session.commit()
        return "Building added successfully", 200


# tools/save_asset?building_id=5&name=asset_name&energy_type=electric
@app.route("/tools/save_asset", methods=["POST"])
@login_required
def save_asset():
    asset_id = request.form.get("save_asset_asset_id")
    building_id = request.form.get("save_asset_building_id")
    name = request.form.get("save_asset_asset_name")
    asset_type_id = request.form.get("save_asset_asset_type_id")
    energy_type = request.form.get("save_asset_energy_type")
    logger.info(
        "Adding asset, asset_id: {}, building_id: {}, name: {}, asset_type_id : {}, energy type: {}".format(
            asset_id, building_id, name, asset_type_id, energy_type
        )
    )

    with DBConnection() as conn:
        sql = "select * from asset where building_id = %s and lower(name) = %s"
        recs = conn.select_dict(sql, [building_id, name.lower()])
        if recs and str(recs[0]["id"]) != asset_id:
            return "Asset name exists, needs to be unique.", 409

    if asset_id:
        asset = Asset.query.filter_by(id=asset_id).first()
        if not asset:
            return "Asset id {} could not be found".format(asset_id), 404
        asset.name = name
        asset.asset_type_id = asset_type_id
        asset.energy_type = energy_type
        db.session.commit()
        return "Asset updated successfully.", 200
    else:
        asset = Asset(
            building_id=building_id,
            name=name,
            asset_type_id=asset_type_id,
            energy_type=energy_type,
        )
        db.session.add(asset)
        db.session.commit()
        return "Asset added successfully.", 200


@app.route("/tools/save_device", methods=["POST"])
@login_required
def save_device():
    device_id = request.form.get("save_device_device_id")
    asset_id = request.form.get("save_device_asset_id")
    name = request.form.get("save_device_name")
    logger.info(
        "Saving device id: {} asset id: {}, name: {}".format(device_id, asset_id, name)
    )

    with DBConnection() as conn:
        sql = "select * from device where asset_id = %s and lower(name) = %s"
        recs = conn.select_dict(sql, [asset_id, name.lower()])
        if recs and str(recs[0]["id"]) != device_id:
            return "Device name exists for this asset, needs to be unique.", 409

    if device_id:
        device = Device.query.filter_by(id=device_id).first()
        if not device:
            return "Device id {} could not be found".format(device_id)
        device.name = name
        db.session.commit()
        return "Device updated successfully", 200
    else:
        device = Device(asset_id=asset_id, name=name)
        db.session.add(device)
        db.session.commit()
        return "Device added successfully.", 200


@app.route("/tools/delete_building", methods=["POST"])
@login_required
def delete_building():
    building_id = request.form.get("building_id")
    logger.info("Deleting building: {}".format(building_id))

    try:
        with DBConnection() as conn:
            sql = "delete from building where id = %s"
            conn.execute(sql, [building_id])
    except Exception as exp:
        traceback.print_exc()
        logger.error("Error while deleting:", exp)
        return "Error, could not delete, please contact Engineering: {}".format(
            traceback.format_exc()
        )

    return "Building deleted successfully."


@app.route("/tools/delete_asset", methods=["POST"])
@login_required
def delete_asset():
    asset_id = request.form.get("asset_id")
    logger.info("Deleting asset: {}".format(asset_id))

    try:
        with DBConnection() as conn:
            sql = "delete from asset where id = %s"
            conn.execute(sql, [asset_id])
    except Exception as exp:
        traceback.print_exc()
        logger.error("Error while deleting:", exp)
        return "Error, could not delete, please contact Engineering: {}".format(
            traceback.format_exc()
        )

    return "Asset deleted successfully."


@app.route("/tools/delete_device", methods=["POST"])
@login_required
def delete_device():
    device_id = request.form.get("device_id")
    logger.info("Deleting device: {}".format(device_id))

    try:
        with DBConnection() as conn:
            sql = "delete from device where id = %s"
            conn.execute(sql, [device_id])

    except Exception as exp:
        traceback.print_exc()
        logger.error("Error while deleting:", exp)
        return "Error, could not delete, please contact Engineering: {}".format(
            traceback.format_exc()
        )

    return "Device deleted successfully."
