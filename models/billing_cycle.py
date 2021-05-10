from datetime import datetime

from common.database import db_session
from models.shared import db


class BillingCycle(db.Model):  # type: ignore
    __tablename__ = "billing_cycle"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    from_day = db.Column(db.Integer, nullable=False, default=1)

    building_id = db.Column(
        db.Integer, db.ForeignKey("building.id"), nullable=False, unique=True
    )
    building = db.relationship(
        "Building", backref="billing_cycles", order_by="BillingCycle.from_day"
    )

    @classmethod
    def get_latest_billing_cycle(cls, building_id: int) -> "BillingCycle":
        with db_session() as session:
            bc = (
                session.query(cls)
                .filter_by(building_id=building_id)
                .order_by(BillingCycle.id.desc())
                .first()
            )  # type: BillingCycle
            return bc
