from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import event
import typing
from typing import List, Optional
from werkzeug.security import generate_password_hash

from common.database import db_session
from models.shared import db


class User(db.Model, UserMixin):  # type: ignore
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_at = db.Column(db.DateTime(), onupdate=datetime.utcnow)
    user_role = db.Column(db.Integer, nullable=False, default=0)

    password = db.Column(db.String(255), nullable=True, server_default="")

    email = db.Column(db.String(255), nullable=False, unique=True)
    confirmed_at = db.Column(db.DateTime())

    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    first_name = db.Column(db.String(255), nullable=False, server_default="")
    last_name = db.Column(db.String(255), nullable=False, server_default="")

    company_id = db.Column(db.Integer, db.ForeignKey("company.id"))
    company = db.relationship("Company", backref="users")

    @classmethod
    def get_user(cls, user_id: int) -> Optional["User"]:
        with db_session() as session:
            user = (
                session.query(cls).filter(cls.id == user_id).one_or_none()
            )  # type: Optional[User]
            return user

    @classmethod
    def create_user(cls, **args: str) -> "User":
        with db_session() as session:
            user = cls(**args)
            session.add(user)
            session.commit()
            return user

    @classmethod
    def get_user_by_email(cls, email: str) -> Optional["User"]:
        with db_session() as session:
            user = (
                session.query(cls).filter(cls.email == email).one_or_none()
            )  # type: Optional[User]
            return user

    @typing.no_type_check
    def __repr__(self) -> str:
        return self.email


@event.listens_for(User.password, "set", retval=True)
def hash_user_password(target, value, oldvalue, initiator):  # type: ignore
    if value != oldvalue:
        return generate_password_hash(value)
    return value
