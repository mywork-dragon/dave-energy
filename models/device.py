from datetime import datetime
from typing import List
from common.database import db_session
from models.shared import db


class Device(db.Model):  # type: ignore
    __tablename__ = "device"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)
    name = db.Column(db.String(255), nullable=False)
    asset_id = db.Column(db.Integer, db.ForeignKey("asset.id"), nullable=False)
    asset = db.relationship("Asset", backref="devices")

    @classmethod
    def get_building_devices_by_asset_type(
        cls, building_id: int, asset_type: str
    ) -> List["Device"]:
        from models.point import Point
        from models.asset import Asset

        with db_session() as session:
            equipments = (
                session.query(cls)
                .join(Point)
                .filter(Asset.building_id == building_id)
                .all()
            )  # type: List["Device"]
            return equipments
