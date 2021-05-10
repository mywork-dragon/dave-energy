"""Unit table

Revision ID: 60c991c986f7
Revises: 1c79a82a5f3d
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60c991c986f7'
down_revision = '1c79a82a5f3d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('unit',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_unit')),
    sa.UniqueConstraint('name', name=op.f('uq_unit_name'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('unit')
    # ### end Alembic commands ###
