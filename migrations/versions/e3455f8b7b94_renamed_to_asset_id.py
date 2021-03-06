"""Renamed to asset_id

Revision ID: e3455f8b7b94
Revises: 8a30b738e5e6
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e3455f8b7b94'
down_revision = '8a30b738e5e6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('equipment', 'device_id', nullable=False, new_column_name='asset_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('equipment', 'asset_id', nullable=False, new_column_name='device_id')
    # ### end Alembic commands ###
