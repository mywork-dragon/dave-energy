from typing import Any, Dict, List
from datetime import datetime
from config import logger
from common.database import db_session
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from models.shared import db


class History(db.Model):  # type: ignore
    __tablename__ = "history"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    point_id = db.Column(
        db.Integer, db.ForeignKey("point.id"), nullable=False, index=True
    )
    point = db.relationship("Point", back_populates="history")

    ts = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    quantity = db.Column(db.Float, nullable=False)

    __table_args__ = (db.UniqueConstraint("point_id", "ts"),)
    __table_args__ = (
        db.CheckConstraint(
            "quantity is not null or mode is not null", name="One column has value"
        ),
        {'extend_existing': True},
    )

    @classmethod
    def create_asset_history(cls, points: List[Dict[Any, Any]]) -> List["History"]:
        """
        creating asset history
        TODO: going one over one here to create the data points.
        Might be too much and it's better to use add_all instead add
        The reason to use is that it's easier to catch unique rows here and skip them
        """
        with db_session() as session:
            data_points = []
            for data_point in points:
                try:
                    hist_point = cls(**data_point)  # type: History
                    session.add(hist_point)
                    session.commit()
                    data_points.append(hist_point)
                except IntegrityError:
                    logger.info(
                        f"Already inserted this data point: {hist_point.point_id},"
                        f" {hist_point.ts}. Skipping"
                    )
                    session.rollback()
                    continue
                except Exception as error:
                    logger.error(f"Exception in create_asset_history: {error}")
                    raise error

            return data_points

    @classmethod
    def get_history(
        cls, point_id: int, from_time: datetime, to_time: datetime
    ) -> List["History"]:
        with db_session() as session:
            history = (
                session.query(cls.ts, cls.quantity)
                .filter(
                    cls.point_id == point_id,
                    and_(
                        cls.ts >= from_time,
                        cls.ts < to_time,
                    ),
                )
                .order_by(cls.ts)
                .all()
            )  # type: List["History"]
            return history

    @classmethod
    def get_asset_history_objects(cls, point_ids: List[int] = []) -> Any:
        with db_session() as session:
            from models.point import Point

            history = (
                session.query(cls).join(cls.point).filter(Point.id.in_(point_ids)).all()
            )  # type: Any
            return history
