
from datetime import datetime

from sqlalchemy.types import Date as Sqlalchemy_Date
from models.shared import db


class BillHistory(db.Model):  # type: ignore
    __tablename__ = "bill_history"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    from_dt = db.Column(Sqlalchemy_Date(), nullable=False)
    to_dt = db.Column(Sqlalchemy_Date(), nullable=False)
    bill_amount_cents = db.Column(db.Integer, nullable=False)
    usage = db.Column(db.Integer, nullable=True)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
    building = db.relationship(
        "Building", backref="bill_history", order_by="BillHistory.from_dt"
    )

    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"), nullable=True)
    unit = db.relationship(
        "Unit", backref="bill_history", order_by="BillHistory.from_dt"
    )