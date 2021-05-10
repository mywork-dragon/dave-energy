
import typing
from typing import List
from datetime import datetime
from enum import Enum
from common.database import db_session
from models.shared import db


class AssetType(db.Model):  # type: ignore
    __tablename__ = "asset_type"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    name = db.Column(db.String(255), nullable=False)
    is_controller_accessible = db.Column(db.Boolean(), default=False)

    __table_args__ = (db.UniqueConstraint("name"), {'extend_existing': True},)