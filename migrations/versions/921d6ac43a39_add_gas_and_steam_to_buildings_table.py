"""Add gas and steam to buildings table

Revision ID: 921d6ac43a39
Revises: b85fad7fe29c
Create Date: 2020-09-13 08:06:28.853495

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '921d6ac43a39'
down_revision = 'b85fad7fe29c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('buildings', sa.Column('consumes_gas', sa.Boolean(), nullable=True))
    op.add_column('buildings', sa.Column('consumes_steam', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('buildings', 'consumes_steam')
    op.drop_column('buildings', 'consumes_gas')
    # ### end Alembic commands ###
