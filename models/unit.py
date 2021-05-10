
from datetime import datetime

from models.shared import db

class Unit(db.Model):  # type: ignore
    __tablename__ = "unit"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    symbol = db.Column(db.String(255), nullable=False)
    measure_of = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), default=0)

    __table_args__ = (db.UniqueConstraint("symbol"), {'extend_existing': True},)