# type: ignore
"""Points table

Revision ID: 1268589f2c36
Revises: 6a4b7c336e0e
Create Date: 2020-04-20 16:47:58.557020

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1268589f2c36"
down_revision = "6a4b7c336e0e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "points",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("unit", sa.String(length=255), nullable=True),
        sa.Column("device_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["device_id"], ["devices.id"], name=op.f("fk_points_device_id_devices")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_points")),
    )
    op.add_column(
        "history", sa.Column("point_id", sa.String(length=255), nullable=True)
    )
    op.create_index(op.f("ix_history_point_id"), "history", ["point_id"], unique=False)
    op.drop_index("idx_history_point", table_name="history")
    op.create_index("idx_history_point", "history", ["point_id", "ts"], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index("idx_history_point", table_name="history")
    op.create_index("idx_history_point", "history", ["device_id", "ts"], unique=False)
    op.drop_index(op.f("ix_history_point_id"), table_name="history")
    op.drop_column("history", "point_id")
    op.drop_table("points")
    # ### end Alembic commands ###
