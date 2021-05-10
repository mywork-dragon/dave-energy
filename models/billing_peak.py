from datetime import datetime
from sqlalchemy import and_
from typing import List

from common.database import db_session
from models.shared import db


class BillingPeak(db.Model):  # type: ignore
    __tablename__ = "billing_peak"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    peak_value = db.Column(db.Float, nullable=False)
    from_time = db.Column(db.Date(), nullable=False)
    to_time = db.Column(db.Date(), nullable=False)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
    building = db.relationship(
        "Building", backref="billing_peak", order_by="BillingPeak.created_at"
    )

    @classmethod
    def get_billing_peaks(
        cls, building_id: int, from_time: datetime, to_time: datetime
    ) -> List["BillingPeak"]:
        with db_session() as session:
            billing_peaks = (
                session.query(cls.peak_value)
                .filter(
                    cls.building_id == building_id,
                    and_(cls.from_time <= from_time, cls.to_time >= to_time,),
                )
                .all()
            )  # type: List["BillingPeak"]
            return billing_peaks
