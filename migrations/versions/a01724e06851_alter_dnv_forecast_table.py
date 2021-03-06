"""Alter dnv_forecast table

Revision ID: a01724e06851
Revises: a18f4e9a8cf7
Create Date: 2021-03-25 23:10:39.360173

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a01724e06851'
down_revision = 'a18f4e9a8cf7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dnv_forecast', sa.Column('utc_computed', sa.DateTime(), nullable=True))
    op.add_column('dnv_forecast', sa.Column('utc_forecast', sa.DateTime(), nullable=True))
    op.drop_column('dnv_forecast', 'time_forecasted')
    op.drop_column('dnv_forecast', 'time_of_forecast')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dnv_forecast', sa.Column('time_of_forecast', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('dnv_forecast', sa.Column('time_forecasted', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('dnv_forecast', 'utc_forecast')
    op.drop_column('dnv_forecast', 'utc_computed')
    # ### end Alembic commands ###
