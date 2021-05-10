import typing
from datetime import datetime
from common.database import db_session
from typing import List, Optional
from models.shared import db


class SolarEdgeCredential(db.Model):  # type: ignore
    __tablename__ = "solar_edge_credential"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    site_id = db.Column(db.String(255), unique=True, nullable=False)
    api_key = db.Column(db.String(255), unique=True, nullable=False)

    asset_id = db.Column(db.Integer, db.ForeignKey("asset.id"))
    asset = db.relationship("Asset", backref="solar_edge_credential")