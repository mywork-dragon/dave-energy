"""Removed point_type from point

Revision ID: c71dfb1a9e09
Revises: 490ecdae7a46
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c71dfb1a9e09'
down_revision = '490ecdae7a46'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('point', 'point_type')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('point', sa.Column('point_type', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
