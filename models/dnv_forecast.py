
from datetime import datetime

from models.shared import db


class DNVForecast(db.Model):  # type: ignore
    __tablename__ = "dnv_forecast"
    id = db.Column(db.Integer, primary_key=True)
    utc_computed = db.Column(db.DateTime(), default=datetime.utcnow)
    utc_forecast = db.Column(db.DateTime(), default=datetime.utcnow)
    power = db.Column(db.Integer, nullable=False)

    building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
    building = db.relationship("Building", backref="dnv_forecasts")

    __table_args__ = (db.UniqueConstraint("building_id", "utc_computed", "utc_forecast"), {'extend_existing': True},)