"""Made columns unique

Revision ID: 85cf33e575c9
Revises: b3a8bb5be345
Create Date: 2020-06-29 17:45:10.462605

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '85cf33e575c9'
down_revision = 'b3a8bb5be345'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(op.f('uq_buildings_address'), 'buildings', ['address'])
    op.create_unique_constraint(op.f('uq_buildings_name'), 'buildings', ['name'])
    op.create_unique_constraint(op.f('uq_devices_name'), 'devices', ['name'])
    op.create_unique_constraint(op.f('uq_history_pointid'), 'history', ['pointid', 'ts'])
    op.drop_constraint('uq_history_point_id', 'history', type_='unique')
    op.create_unique_constraint(op.f('uq_points_name'), 'points', ['name'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('uq_points_name'), 'points', type_='unique')
    op.create_unique_constraint('uq_history_point_id', 'history', ['point_id', 'ts'])
    op.drop_constraint(op.f('uq_history_pointid'), 'history', type_='unique')
    op.drop_constraint(op.f('uq_devices_name'), 'devices', type_='unique')
    op.drop_constraint(op.f('uq_buildings_name'), 'buildings', type_='unique')
    op.drop_constraint(op.f('uq_buildings_address'), 'buildings', type_='unique')
    # ### end Alembic commands ###
