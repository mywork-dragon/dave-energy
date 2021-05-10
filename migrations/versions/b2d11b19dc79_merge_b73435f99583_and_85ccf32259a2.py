"""merge b73435f99583 and 85ccf32259a2

Revision ID: b2d11b19dc79
Revises: b73435f99583, 85ccf32259a2
Create Date: 2020-07-01 11:32:38.172478

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2d11b19dc79'
down_revision = ('b73435f99583', '85ccf32259a2')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
