"""Removed unneeded column

Revision ID: 85ccf32259a2
Revises: 73c67a2a261b
Create Date: 2020-07-01 10:48:59.780367

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '85ccf32259a2'
down_revision = '73c67a2a261b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('idx_history_point', table_name='history')
    op.drop_index('ix_history_point_id', table_name='history')
    op.drop_column('history', 'point_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('history', sa.Column('point_id', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    op.create_index('ix_history_point_id', 'history', ['point_id'], unique=False)
    op.create_index('idx_history_point', 'history', ['point_id', 'ts'], unique=False)
    # ### end Alembic commands ###
