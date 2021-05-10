
import pytz
from datetime import datetime

import collections
from typing import Any, Dict, List

from data.db_connection import DBConnection
from common import utils


def get_summed_point_history(point_ids: List, utc_from_time: datetime, utc_to_time: datetime, in_tz: str = 'UTC'):
    ts_to_quantity = collections.OrderedDict()
    for point_id in point_ids:
        for hist in get_point_history(point_id, utc_from_time, utc_to_time, in_tz):
            if hist["ts"] in ts_to_quantity:
                ts_to_quantity[hist["ts"]] += hist["quantity"]
            else:
                ts_to_quantity[hist["ts"]] = hist["quantity"]

    ts_and_quantities = []
    for ts, quantity in ts_to_quantity.items():
        ts_and_quantities.append(
            {
                "ts": ts,
                "quantity": quantity
            }
        )

    return ts_and_quantities

def get_point_history(
    point_id: int, utc_from_time: datetime, utc_to_time: datetime, in_tz: str = 'UTC'
) -> List[Dict[str, Any]]:
    ret_tz = pytz.timezone(in_tz)
    ts_and_quantities = []
    with DBConnection() as conn:
        sql = """select ts, quantity
            from history hist
            where hist.point_id = %s
            and hist.ts >= %s
            and hist.ts <= %s
            order by hist.ts
            """
        for rec in conn.select_dict(sql, [point_id, utc_from_time, utc_to_time]):
            quantity = rec["quantity"]
            if quantity:
                ts = utils.round_up_to_current_fifteen_minutes(rec["ts"])
                ts = ts.astimezone(ret_tz)

                ts_and_quantities.append({"ts": ts, "quantity": quantity})

    return ts_and_quantities