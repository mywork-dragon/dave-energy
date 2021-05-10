import typing
from datetime import datetime
from common.database import db_session
from typing import Optional
from models.shared import db


class Building(db.Model):  # type: ignore
    __tablename__ = "building"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    name = db.Column(db.String(255), unique=True, nullable=False)
    # Public address, which everyone knows the building
    address = db.Column(db.String(255), unique=True, nullable=False)
    # This is not public address, this might be listed on UtilityAPI
    service_address = db.Column(db.String(255), unique=True, nullable=True)
    utility = db.Column(db.String(255))
    market = db.Column(db.String(255))
    sq_footage = db.Column(db.Integer)
    occupancy = db.Column(db.Integer)
    zipcode = db.Column(db.String(255))
    consumes_gas = db.Column(db.Boolean(), default=False)
    consumes_steam = db.Column(db.Boolean(), default=False)
    status = db.Column(db.Integer, default=0)
    tz = db.Column(db.String(255), default="America/New_York")

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("User", backref="buildings")

    company_id = db.Column(db.Integer, db.ForeignKey("company.id"))
    company = db.relationship("Company", backref="buildings")

    portfolio_manager_propertyid = db.Column(db.Integer)

    @classmethod
    def get_building(cls, building_id: int) -> Optional["Building"]:
        with db_session() as session:
            building = (
                session.query(cls).filter(cls.id == building_id).one_or_none()
            )  # type: Optional["Building"]
            return building

    @classmethod
    def get_building_by_address(cls, address: str) -> Optional["Building"]:
        with db_session() as session:
            building = (
                session.query(cls).filter(cls.address == address).one_or_none()
            )  # type: Optional["Building"]
            return building

    @classmethod
    def get_building_by_name(cls, name: str) -> Optional["Building"]:
        with db_session() as session:
            building = (
                session.query(cls).filter(cls.name == name).one_or_none()
            )  # type: Optional["Building"]
            return building

    @classmethod
    def create_building(cls, **args: str) -> "Building":
        with db_session() as session:
            building = cls(**args)
            session.add(building)
            session.commit()
            return building

    @typing.no_type_check
    def __repr__(self) -> str:
        return self.address
