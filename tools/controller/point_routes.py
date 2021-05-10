import traceback

from flask import jsonify
from flask import request

from app import app
from controller.common_routes import login_required
from config import logger
from data.db_connection import DBConnection
from models.asset import Asset
from models.point import Point
from models.shared import db

POINT_TAGS_WHICH_NEED_UNIT_SET = ["DEFAULT_SETPOINT", "METER", "METER_EXPORT"]
POINT_UNIQUE_TAGS = ["METER", "METER_EXPORT"]


@app.route("/tools/get_point_attributes", methods=["GET"])
@login_required
def get_point_attributes():
    point_id = request.args.get("point_id")
    logger.info(
        "Inside get_point_attributes. Reading attributes for point {}".format(point_id)
    )
    resp = {}
    point = Point.query.filter(Point.id == point_id).first()
    if not point:
        return "Could not find point with id {}".format(point_id), 404
    resp["path"] = point.path
    resp["name"] = point.name
    resp["tag"] = point.tag
    resp["unit_id"] = point.unit_id
    resp["device_id"] = point.device_id
    resp["asset_id"] = point.asset_id
    asset = Asset.query.filter_by(id=point.asset_id).first()
    resp["building_id"] = asset.building_id
    return jsonify(resp)


# tools/save_point?asset_id=10&name=point_name&path=point_path&unit=kW&is_writable=1&is_main=0&tag=REAL_TIME_REDUCTION&asset_type=HVAC
@app.route("/tools/save_point", methods=["POST"])
@login_required
def save_point():
    point_id = (
        int(request.form.get("save_point_point_id"))
        if request.form.get("save_point_point_id")
        else None
    )
    asset_id = request.form.get("save_point_asset_id")
    device_id = request.form.get("save_point_device_id")
    name = request.form.get("save_point_name")
    path = request.form.get("save_point_path")
    unit_id = request.form.get("save_point_unit")
    tag = request.form.get("save_point_tag")

    if tag in POINT_TAGS_WHICH_NEED_UNIT_SET and not unit_id:
        return {
            "validation_error": "For a point tagged as DEFAULT_SETPOINT, METER or METER_EXPORT, unit also needs to be set."
        }, 400

    point = Point.query.filter_by(path=path).filter(Point.id != point_id).first()
    if point:
        return {
            "validation_error": "Requested path {} already used by point with id {}".format(
                path, point.id
            )
        }, 400

    if asset_id:
        if tag in POINT_UNIQUE_TAGS:
            point = Point.query.filter_by(asset_id=int(asset_id), tag=tag).first()
            if point:
                return {
                    "validation_error": "Point {} already exists with tag {} for asset {}".format(
                        point.id, tag, asset_id
                    )
                }, 400

        logger.info(
            "Adding point, asset id: {}, device_id: {}, name: {}, path: {}, unit_id: {}, tag: {}".format(
                asset_id, device_id, name, path, unit_id, tag
            )
        )
        point = Point(
            asset_id=int(asset_id),
            device_id=int(device_id) if device_id else None,
            path=path,
            unit_id=int(unit_id) if unit_id else None,
            name=name,
            tag=tag,
        )
        db.session.add(point)
        db.session.commit()
        return "Point added successfully.", 200

    if point_id:
        if tag in POINT_UNIQUE_TAGS:
            point = (
                Point.query.filter_by(
                    asset_id=Point.query.filter_by(id=point_id).first().asset_id,
                    tag=tag,
                )
                .filter(Point.id != point_id)
                .first()
            )
            if point:
                return {
                    "validation_error": "Point {} already exists with tag {} for asset {}".format(
                        point.id, tag, point.asset_id
                    )
                }, 400
        logger.info(
            "Updating point, point_id: {}, name: {}, path: {}, unit_id: {}, tag: {}".format(
                point_id, name, path, unit_id, tag
            )
        )
        point = Point.query.filter_by(id=point_id).first()
        if not point:
            logger.warning("Point does not exist.")
            return "Point does not exist.", 404
        point.name = name
        point.path = path
        point.unit_id = int(unit_id) if unit_id else None
        point.tag = tag
        db.session.add(point)
        db.session.commit()
        return "Point updated successfully.", 200

    return {"validation_error": "point_id or asset_id must be provided"}, 400


@app.route("/tools/delete_point", methods=["POST"])
@login_required
def delete_point():
    point_id = request.form.get("point_id")
    logger.info("Deleting point: {}".format(point_id))

    try:
        with DBConnection() as conn:
            sql = "delete from point where id = %s"
            conn.execute(sql, [point_id])
    except Exception as exp:
        traceback.print_exc()
        logger.error("Error while deleting:", exp)
        return "Error, could not delete, please contact Engineering: {}".format(
            traceback.format_exc()
        )

    return "Point deleted successfully."
