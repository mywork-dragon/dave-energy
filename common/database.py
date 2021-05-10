from contextlib import contextmanager

from sqlalchemy.orm import scoped_session
from models.shared import db


@contextmanager
def db_session() -> scoped_session:
    """
    Geneerate session and yield it.
    After resuming, commit, unless an exception happens. In this case - rollback

    :return: a generator for a scoped session
    """
    session = db.session
    try:
        yield session
        session.commit()
    except BaseException:
        session.rollback()
        raise
