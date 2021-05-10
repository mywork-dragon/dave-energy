from typing import Any, List, Dict
from config import logger
from datetime import datetime
from sqlalchemy.orm import validates
from sqlalchemy.exc import IntegrityError

from common.database import db_session
from models.shared import db


class EnergyStar(db.Model):  # type: ignore
    __tablename__ = "energy_star"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)
    score = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
    building = db.relationship("Building", backref="energy_stars")

    __table_args__ = (
        db.UniqueConstraint("building_id", "month", "year"),
        {"extend_existing": True},
    )

    @classmethod
    def get_building_energy_star(cls, building_id: int, year: int) -> Any:
        with db_session() as session:
            building_energy_star = session.query(cls).filter(
                cls.building_id == building_id, cls.year == year
            )  # type: Any
            return building_energy_star

    @classmethod
    def create_energy_star(cls, data: List[Dict[Any, Any]]) -> List["EnergyStar"]:
        with db_session() as session:
            energy_stars = []
            for data_point in data:
                try:
                    energy_star = cls(**data_point)
                    session.add(energy_star)
                    session.commit()
                    energy_stars.append(energy_star)
                except IntegrityError:
                    logger.info("Already inserted this data point. Skipping")
                    session.rollback()
                except Exception as error:
                    logger.error(error)
                    raise error
            return energy_stars
