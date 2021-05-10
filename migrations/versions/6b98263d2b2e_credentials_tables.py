"""Credentials tables

Revision ID: 6b98263d2b2e
Revises: b9b2f92dfc60
Create Date: 2020-07-13 13:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6b98263d2b2e'
down_revision = 'b9b2f92dfc60'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('n4_credential',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('ip_address', sa.String(length=255), nullable=False),
    sa.Column('port', sa.String(length=255), nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('building_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['building_id'], ['buildings.id'], name=op.f('fk_n4_credential_building_id_buildings')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_n4_credential')),
    sa.UniqueConstraint('ip_address', name=op.f('uq_n4_credential_ip_address')),
    sa.UniqueConstraint('password', name=op.f('uq_n4_credential_password')),
    sa.UniqueConstraint('port', name=op.f('uq_n4_credential_port')),
    sa.UniqueConstraint('username', name=op.f('uq_n4_credential_username'))
    )
    op.create_table('solar_edge_credential',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('site_id', sa.String(length=255), nullable=False),
    sa.Column('api_key', sa.String(length=255), nullable=False),
    sa.Column('device_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['device_id'], ['devices.id'], name=op.f('fk_solar_edge_credential_device_id_devices')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_solar_edge_credential')),
    sa.UniqueConstraint('api_key', name=op.f('uq_solar_edge_credential_api_key')),
    sa.UniqueConstraint('site_id', name=op.f('uq_solar_edge_credential_site_id'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('solar_edge_credential')
    op.drop_table('n4_credential')
    # ### end Alembic commands ###
