"""Add EnergyStar.month, EnergyStar.year

Revision ID: da12c5cfbf5c
Revises: 3911bca0beb4
Create Date: 2021-03-24 13:19:22.024862

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "da12c5cfbf5c"
down_revision = "3911bca0beb4"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("energy_stars", sa.Column("month", sa.Integer(), nullable=True))
    op.add_column("energy_stars", sa.Column("year", sa.Integer(), nullable=True))
    op.execute("UPDATE energy_stars SET month=CAST(SUBSTRING(date, 1, 2) AS INT);")
    op.execute("UPDATE energy_stars SET year=CAST(SUBSTRING(date, 4, 7) AS INT);")
    op.alter_column("energy_stars", "month", existing_type=sa.INTEGER(), nullable=False)
    op.alter_column("energy_stars", "year", existing_type=sa.INTEGER(), nullable=False)
    op.create_unique_constraint(
        "energy_stars_building_id_month_year_key",
        "energy_stars",
        ["building_id", "month", "year"],
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        "energy_stars_building_id_month_year_key", "energy_stars", type_="unique"
    )
    op.drop_column("energy_stars", "year")
    op.drop_column("energy_stars", "month")
    # ### end Alembic commands ###
