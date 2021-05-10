import typing
from typing import List
from datetime import datetime
from enum import Enum
from common.database import db_session
from models.shared import db


class ThirdParties(Enum):
    N4 = "N4"
    SOLAR_EDGE = "Solar_Edge"
    HEAT_WATCH = "Heat_Watch"


class Asset(db.Model):  # type: ignore
    __tablename__ = "asset"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    name = db.Column(db.String(255), nullable=False)
    energy_type = db.Column(db.String(255))  # gas/steam/electric

    asset_type_id = db.Column(
        db.Integer, db.ForeignKey("asset_type.id"), nullable=False
    )
    asset_type = db.relationship("AssetType", backref="assets")

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
    building = db.relationship("Building", backref="assets")

    __table_args__ = (db.UniqueConstraint("building_id", "name"), {'extend_existing': True},)

    @classmethod
    def get_assets_by_energy_type(
        cls, building_id: int, energy_type: str
    ) -> List["Asset"]:
        with db_session() as session:
            assets = (
                session.query(cls)
                .filter(cls.building_id == building_id, cls.energy_type == energy_type)
                .all()
            )  # type: List[Asset]
            return assets

    @classmethod
    def get_asset_by_name(cls, asset_name: str) -> "Asset":
        with db_session() as session:
            asset = (
                session.query(cls).filter(cls.name == asset_name).one_or_none()
            )  # type: Asset
            return asset

    @classmethod
    def get_asset_by_id(cls, asset_id: int) -> "Asset":
        with db_session() as session:
            asset = (
                session.query(cls).filter(cls.id == asset_id).one_or_none()
            )  # type: Asset
            return asset

    @typing.no_type_check
    def __repr__(self) -> str:
        return self.name

    @classmethod
    def get_assets_by_third_party(cls, third_party: str) -> List["Asset"]:
        with db_session() as session:
            assets = session.query(cls).all()  # type: Asset
            return assets

    @classmethod
    def get_assets_by_type(cls, energy_type: str) -> List["Asset"]:
        with db_session() as session:
            assets = (
                session.query(cls).filter(cls.energy_type == energy_type).all()
            )  # type: List[Asset]
            return assets
