from datetime import datetime, timedelta

import hszinc
from pyhaystack.client.niagara import Niagara4HaystackSession
import pytz

from config import logger
from common.constants import N4_TIMEOUT
from data.db_connection import DBConnection
from scheduled_jobs import lcl_utils
from typing import Optional

# Logging
# Alerting


class N4Reader:
    def __init__(self, building_id: int):
        self.n4_session = lcl_utils.get_n4_connection(building_id)

    # Read N4 values for each point and write to db
    def copy_point_values(self, point_id: int, point_path: str, from_dt: Optional[datetime] = None,
        to_dt: Optional[datetime] = None, persist_tz: str = "UTC") -> None:

        tz = pytz.timezone(persist_tz)
        _today = datetime.now()
        rng = "today"
        if from_dt:
            if from_dt.date == _today.date:
                # 
                rng = "today"
            else:
                if not to_dt:
                    to_dt = datetime.utcnow() + timedelta(days=1)
                rng = f"{{from_dt}},{{to_dt}}".format(
                    from_dt=from_dt.strftime("%Y-%m-%d"), to_dt=to_dt.strftime("%Y-%m-%d")
                )

        logger.info("Reading N4 data for point: {}, {} for the range: {}".format(
                point_id, point_path, rng))
        op = self.n4_session.his_read(point_path, rng=rng)

        with DBConnection() as conn:
            cnt = 0
            for row in op.result._row:
                ts = row["ts"]
                if hasattr(row["val"], "value"):
                    quantity = row["val"].value
                elif isinstance(row["val"], float):
                    quantity = row["val"]
                elif isinstance(row["val"], bool):
                    quantity = 1 if row["val"] else 0
                else:
                    raise Exception("Could not determine value, {}".format(row["val"]))

                dt_in_tz = ts.astimezone(tz)

                sql = """insert into history (point_id, ts, quantity, created_at)
                    values (%s, %s, %s, CLOCK_TIMESTAMP())
                    ON CONFLICT (point_id, ts)
                    DO NOTHING
                    """
                conn.execute(sql, [point_id, dt_in_tz, quantity])
                cnt += 1
            logger.info("Read and persisted {} N4 values.".format(cnt))


if __name__ == "__main__":
    n4_reader = N4Reader(5)

    to_dt = datetime.now()
    from_dt = to_dt - timedelta(days=1)
    # n4_reader.copy_point_values(from_dt, to_dt)
