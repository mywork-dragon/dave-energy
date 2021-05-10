# type: ignore
from random import randint
from datetime import datetime, timedelta
from models.history import History


def create_history_points(dt_str: str, point_id: int):
    date = datetime.strptime(dt_str, "%Y-%m-%d")
    history_points = []
    for minutes in range(0, (96 * 15) + 1, 15):
        history_points.append(
            dict(
                quantity=str(randint(20, 100)),
                ts=date + timedelta(minutes=minutes),
                point_id=point_id,
            )
        )
    History.create_asset_history(history_points)


if __name__ == "__main__":
    """
    Run Command: PYTHONPATH=./ FLASK_ENV=development pipenv run python tests/scripts/load_history.py
    """
    dt_str = "2020-07-27"
    point_id = 1
    create_history_points(dt_str, point_id)
