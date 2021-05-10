"""One of the columns has to have a value

Revision ID: 73d07db61d39
Revises: cf272fc59186
Create Date: 2020-07-01 12:47:56.182314

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73d07db61d39'
down_revision = 'cf272fc59186'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # ### end Alembic commands ###

    op.create_check_constraint("atleast_one_measurement", "history", "quantity is not null or mode is not null")


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # ### end Alembic commands ###

    op.drop_constraint("atleast_one_measurement", "history", type_="check")
