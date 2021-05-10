import random
from typing import List, Dict, Any
from models.dispatch import EventTypes


# Generate data for POST request
def generate_dispatch_data(point_id: int) -> List[Dict[Any, Any]]:
    dispatch_data = []
    for value in range(10):
        data = {
            "point_id": point_id,
            "schedule_date": f"1/2/19 {value}:00",
            "power_kw": None,
            "event_type": random.choice([et.value for et in EventTypes]),
        }
        dispatch_data.append(data)
    return dispatch_data


def generate_wrong_dispatch_data(point_id: int) -> List[Dict[Any, Any]]:
    dispatch_data = []
    for value in range(5):
        data = {
            "point_id": point_id,
            "schedule_date": f"1-2-19 {value}:00",
            "power_kw": None,
            "event_type": random.choice([et.value for et in EventTypes]),
        }
        dispatch_data.append(data)
    return dispatch_data


def generate_dispatch_data_with_exceptions(point_id: int) -> List[Dict[Any, Any]]:
    data = generate_dispatch_data(point_id)
    data.append(data[-1])  # Duplicating Data
    data[0]["point_id"] = point_id + 1
    return data
