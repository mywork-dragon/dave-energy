import typing
from datetime import datetime
from common.database import db_session
from typing import List, Optional
from models.shared import db


class N4Credential(db.Model):  # type: ignore
    __tablename__ = "n4_credential"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    ip_address = db.Column(db.String(255), unique=True, nullable=False)
    port = db.Column(db.String(255), unique=False, nullable=False)
    username = db.Column(db.String(255), unique=False, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"))
    building = db.relationship("Building", backref="n4_credential")