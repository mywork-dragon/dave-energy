from app import login_manager, app
import traceback
from werkzeug.exceptions import HTTPException
from enum import Enum
from functools import wraps
from typing import Any, Callable, Optional

from flask import jsonify, request, redirect
from flask_login import current_user

from common.exceptions import (
    AuthenticationError,
    ResourceConflictError,
    ResourceNotFound,
)
import marshmallow
from common.utils import building_associated_with_user
from config import logger


@app.errorhandler(Exception)
def handle_exception(exc):  # type:ignore
    # pass through HTTP errors
    if isinstance(exc, HTTPException):
        return exc

    if isinstance(exc, marshmallow.exceptions.ValidationError):
        logger.error(f"Payload: {request.args}")
        return jsonify(error=exc.messages), 400

    if isinstance(exc, ResourceNotFound):
        return jsonify(error=exc.message), 404

    # now you're handling non-HTTP exceptions only
    exc_msg = traceback.format_exc()
    logger.error(exc_msg)
    return jsonify({"err_msg": exc_msg}), 500


@login_manager.user_loader
def load_user(user_id):  # type: ignore
    from models.user import User

    return User.get_user(user_id)


def login_required(function: Callable):  # type: ignore
    @wraps(function)
    def wrapped(*args, **kwargs):  # type: ignore
        if not current_user.is_authenticated:
            return redirect("/login", code=302)
        return function(*args, **kwargs)

    return wrapped

def _get_user_id_from_request() -> Any:
    if request.method == "GET":
        return request.args.get("user_id", None)

    return request.json.get("user_id", None)


def get_current_user(user_id: Optional[int] = None) -> Any:
    """
    if we have a user_id in the signature - use that
    if se have a user_id in the request - use that
    if user is admin, get the user_id we want

    and if user is not admin, return current_user
    """
    from models.user import User

    if not user_id:
        user_id = _get_user_id_from_request()

    if user_id and current_user.is_admin():
        return User.get_user(user_id)
    elif current_user and not current_user.is_anonymous:
        return User.get_user(current_user.id)

    return None


class UtilityTypes(Enum):
    Electric = "electric"
    Gas = "gas"
    Steam = "steam"