"""merge 73f5bd652fe9 and 97a835511bb3

Revision ID: 1e56b910baf5
Revises: 73f5bd652fe9, 97a835511bb3
Create Date: 2021-01-14 12:27:05.245917

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1e56b910baf5"
down_revision = ("73f5bd652fe9", "97a835511bb3")
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
