from typing import Tuple

from flask import jsonify, request
from werkzeug import Response

from app import app
from controller.common_routes import login_required
from serializers.weather_serializers import weather_request_schema
from services.weather_service import fetch_weather_information


@app.route("/weather", methods=["GET"])
@login_required
def get_weather() -> Tuple[Response, int]:
    request_data = weather_request_schema.load(request.args)
    response = fetch_weather_information(request_data["zip_code"])
    return jsonify(response), 200
