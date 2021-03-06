"""Renamed column to point_id

Revision ID: cf272fc59186
Revises: b2d11b19dc79
Create Date: 2020-07-01 11:37:03.116527

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cf272fc59186'
down_revision = 'b2d11b19dc79'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('history', 'pointid', nullable=False, new_column_name='point_id')

    # op.add_column('history', sa.Column('point_id', sa.Integer(), nullable=False))
    op.drop_constraint('uq_history_pointid', 'history', type_='unique')
    op.create_unique_constraint(op.f('uq_history_point_id'), 'history', ['point_id', 'ts'])
    # op.drop_constraint('fk_history_pointid_points', 'history', type_='foreignkey')
    # op.create_foreign_key(op.f('fk_history_point_id_points'), 'history', 'points', ['point_id'], ['id'])
    # op.drop_column('history', 'pointid')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('history', 'point_id', nullable=False, new_column_name='pointid')

    op.drop_constraint('uq_history_point_id', 'history', type_='unique')
    op.create_unique_constraint(op.f('uq_history_pointid'), 'history', ['pointid', 'ts'])
    # ### end Alembic commands ###
