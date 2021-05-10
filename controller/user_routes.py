from flask import request, jsonify, session
from typing import Tuple
import marshmallow
from werkzeug import Response
from app import app
from common.exceptions import (
    ResourceConflictError,
    ResourceNotFound,
    AuthenticationError,
)
from services.user_service import create_user, get_user
from flask_login import login_user, logout_user
from controller.common_routes import login_required, get_current_user


@app.route("/login", methods=["POST"])
def login() -> Tuple[Response, int]:
    """
    login a user with email and password
    """
    try:
        user = get_user(email=request.json["email"], password=request.json["password"])
        login_user(user)
        resp = {
            "user_role": user.user_role
        }
        return jsonify(resp), 200

    except marshmallow.exceptions.ValidationError as error:
        return jsonify(error=error.messages), 400
    except ResourceNotFound as error:
        return jsonify(error=error.message), 404
    except AuthenticationError as error:
        return jsonify(error=error.message), 403


@app.route("/register", methods=["POST"])
def register() -> Tuple[Response, int]:
    """
    register a user with an email and a password
    """
    try:
        user = create_user(email=request.json["email"], password=request.json["password"])
        login_user(user)
        
    except marshmallow.exceptions.ValidationError as error:
        return jsonify(error=error.messages), 400
    except ResourceConflictError as error:
        return jsonify(error=error.message), 409

    return jsonify("user registered successfully"), 200


@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout() -> Tuple[Response, int]:
    """
    logout a user
    """
    logout_user()
    session.clear() # Remove session cookie from client browser
    return jsonify("logged out user successfully"), 200


@app.route("/user", methods=["GET"])
@login_required
def user() -> Tuple[Response, int]:
    user = get_current_user()
    resp = {
        "user_role": user.user_role
    }
    return jsonify(resp), 200
