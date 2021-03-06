"""Removed unneeded column

Revision ID: b73435f99583
Revises: 73c67a2a261b
Create Date: 2020-07-01 09:13:29.578959

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b73435f99583'
down_revision = '73c67a2a261b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('devices', 'unit')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devices', sa.Column('unit', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
