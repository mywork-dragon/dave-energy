from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional, Any, Dict
from common.database import db_session
from sqlalchemy.sql import text
from models.shared import db


class EventTypes(Enum):
    DEMAND_RESPONSE = "DR"
    ICAP = "ICAP"
    DCM = "DCM"


class DispatchStatus(Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN PROGRESS"
    SUCCESS = "SUCCESS"
    FAIL = "FAIL"


class Dispatch(db.Model):  # type: ignore
    __tablename__ = "dispatch"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    schedule_date = db.Column(db.DateTime(timezone=True), nullable=False)
    end_date = db.Column(db.DateTime(timezone=True), nullable=False)
    status = db.Column(db.String(30), server_default="PENDING")  # DispatchStatus enum
    power_kw = db.Column(db.Float(), nullable=True)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=True)
    building = db.relationship("Building", backref="dispatches")

    event_type = db.Column(db.String(30), nullable=False)  # EventTypes enum