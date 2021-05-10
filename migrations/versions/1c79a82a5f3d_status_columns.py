"""Status columns

Revision ID: 1c79a82a5f3d
Revises: 6b98263d2b2e
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1c79a82a5f3d'
down_revision = '6b98263d2b2e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('buildings', sa.Column('status', sa.Integer(), nullable=True))
    op.add_column('companies', sa.Column('status', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('companies', 'status')
    op.drop_column('buildings', 'status')
    # ### end Alembic commands ###
