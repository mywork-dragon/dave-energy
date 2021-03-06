"""Renamed table to singular name

Revision ID: 1af6f12d81eb
Revises: e29db32fc7ce
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1af6f12d81eb'
down_revision = 'e29db32fc7ce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.rename_table('dispatches', 'dispatch')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.rename_table('dispatch', 'dispatches')
    # ### end Alembic commands ###
