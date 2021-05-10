from datetime import datetime
from enum import Enum
from sqlalchemy.orm import validates
import typing
from typing import List, Optional

from common.database import db_session
from models.asset import Asset
from models.shared import db


class PointTag(Enum):
    TARGET_REDUCTION = "TARGET_REDUCTION"
    REAL_TIME_REDUCTION = "REAL_TIME_REDUCTION"
    DEFAULT_SETPOINT = "DEFAULT_SETPOINT"
    EVENT_SETPOINT = "EVENT_SETPOINT"
    OVERRIDE_SETPOINT = "OVERRIDE_SETPOINT"
    EVENT_STATUS = "EVENT_STATUS"
    EVENT_TYPE = "EVENT_TYPE"


class Point(db.Model):  # type: ignore
    __tablename__ = "point"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    path = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)

    asset_id = db.Column(db.Integer, db.ForeignKey("asset.id"), nullable=False)

    history = db.relationship(
        "History",
        back_populates="point",
        order_by="History.id",
        cascade="all, delete-orphan",
    )

    asset = db.relationship("Asset", backref="points")

    tag = db.Column(db.String(255), nullable=True)  # PointTag Enum

    device_id = db.Column(db.Integer, db.ForeignKey("device.id"), nullable=True)
    device = db.relationship("Device", backref="points")

    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"), nullable=True)
    unit = db.relationship("Unit", backref="points")

    portfolio_manager_meterid = db.Column(db.Integer)

    @classmethod
    def create_point(cls, **args: str) -> "Point":
        with db_session() as session:
            point = cls(**args)
            session.add(point)
            session.commit()
            return point

    @classmethod
    def get_point_by_id(cls, point_id: int) -> "Point":
        with db_session() as session:
            point = (
                session.query(cls).filter(cls.id == point_id).one_or_none()
            )  # type: Point
            return point

    @classmethod
    def get_point_by_path(cls, point_path: str) -> "Point":
        with db_session() as session:
            point = (
                session.query(cls).filter(cls.path == point_path).one_or_none()
            )  # type: Point
            return point

    @classmethod
    def get_points_by_tag(cls, tag: str, building_id: int) -> List["Point"]:
        with db_session() as session:
            points = (
                session.query(cls)
                .join(Asset)
                .filter(Asset.building_id == building_id, cls.tag == tag)
            ).all()  # type: List[Point]
            return points

    @classmethod
    def get_point_by_tag(cls, tag: str, building_id: int) -> Optional["Point"]:
        with db_session() as session:
            point = (
                session.query(cls)
                .join(Asset)
                .filter(Asset.building_id == building_id, cls.tag == tag)
            ).one_or_none()  # type: Optional[Point]
            return point

    @typing.no_type_check
    def __repr__(self) -> str:
        return self.path

    @classmethod
    def get_points_by_asset_name(cls, asset_name: str) -> List["Point"]:
        from models.asset import Asset

        with db_session() as session:
            points = (
                session.query(cls)
                .join(cls.asset)
                .filter(Asset.name == asset_name)
                .all()
            )  # type: List["Point"]
            return points
