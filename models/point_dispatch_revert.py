from datetime import datetime
from enum import Enum
from sqlalchemy.orm import validates
import typing
from typing import Any, List, Optional

from common.database import db_session
from models.asset import Asset
from models.shared import db

class PointDispatchRevert(db.Model):  # type: ignore
    __tablename__ = "point_dispatch_revert"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    point_id = db.Column(db.Integer, db.ForeignKey("point.id"), nullable=False)
    point = db.relationship("Point", backref="point_dispatch_revert")

    dispatch_id = db.Column(db.Integer, db.ForeignKey("dispatch.id"), nullable=False)
    dispatch = db.relationship("Dispatch", backref="point_dispatch_revert")

    user_id_reverted = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("User", backref="point_dispatch_revert")
    utc_reverted = db.Column(db.DateTime(), default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint("point_id", "dispatch_id"), {'extend_existing': True},)
