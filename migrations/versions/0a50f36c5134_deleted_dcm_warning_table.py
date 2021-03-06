"""Deleted dcm_warning table

Revision ID: 0a50f36c5134
Revises: d18291208f42
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0a50f36c5134'
down_revision = 'd18291208f42'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dcm_warning')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dcm_warning',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('schedule_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('end_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('event_type', sa.VARCHAR(length=30), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='pk_dcm_warning')
    )
    # ### end Alembic commands ###
