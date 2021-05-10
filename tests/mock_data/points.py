from datetime import datetime
import random
from typing import Dict

## Generate points every 15 minutes for 24 hours
def generate_points(
    low: int = 200,
    high: int = 300,
    precision: int = 0,
    includeNullQuantities: bool = False
):
    points = []

    for minute in range(0, 11):
        if includeNullQuantities and random.uniform(0, 10) < 1:
            firstPoint = {
                "quantity": None,
                "ts": datetime(2020, 4, 25, minute, 00),
                "status": "Charging",
            }
        else:
            firstPoint = {
                "quantity": round(random.uniform(low, high), precision),
                "ts": datetime(2020, 4, 25, minute, 00),
                "status": None,
            }


        points.append(firstPoint)
        points.append({
            "quantity": round(random.uniform(low, high), precision),
            "ts": datetime(2020, 4, 25, minute, 15),
            "status": None,
        })
        points.append({
            "quantity": round(random.uniform(low, high), precision),
            "ts": datetime(2020, 4, 25, minute, 30),
            "status": None,
        })
        points.append({
            "quantity": round(random.uniform(low, high), precision),
            "ts": datetime(2020, 4, 25, minute, 45),
            "status": None,
        })

    return points
