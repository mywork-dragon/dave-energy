"""Make non-nullable: point.name, asset.asset_type_id, history.quantity.

Revision ID: ddcb9988f16f
Revises: ab498d148208
Create Date: 2021-02-25 18:26:51.823285

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "ddcb9988f16f"
down_revision = "ab498d148208"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "asset", "asset_type_id", existing_type=sa.INTEGER(), nullable=False
    )
    op.alter_column(
        "history",
        "quantity",
        existing_type=postgresql.DOUBLE_PRECISION(precision=53),
        nullable=False,
    )
    op.alter_column(
        "point", "name", existing_type=sa.VARCHAR(length=255), nullable=False
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "point", "name", existing_type=sa.VARCHAR(length=255), nullable=True
    )
    op.alter_column(
        "history",
        "quantity",
        existing_type=postgresql.DOUBLE_PRECISION(precision=53),
        nullable=True,
    )
    op.alter_column("asset", "asset_type_id", existing_type=sa.INTEGER(), nullable=True)
    # ### end Alembic commands ###
