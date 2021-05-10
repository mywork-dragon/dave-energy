
from datetime import datetime

from models.shared import db

class Company(db.Model):  # type: ignore
    __tablename__ = "company"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)

    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Integer, default=0)

    __table_args__ = (db.UniqueConstraint("name"), {'extend_existing': True},)