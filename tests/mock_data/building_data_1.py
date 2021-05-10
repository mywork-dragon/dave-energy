# type: ignore
from tests.mock_data.points import generate_points

electric_1 = {
    "device_type": "Electric",
    "name": "HVAC",
    "unit": "kwh",
    "points": generate_points(438, 910, 4, True),
}

electric_2 = {
    "device_type": "Electric",
    "name": "SOLAR",
    "unit": "kwh",
    "points": generate_points(91, 350, 4),
}

meter = {
    "device_type": "Electric",
    "name": "Meter",
    "unit": "kwh",
    "points": consumption - supply,
}


gas_1 = {
    "device_type": "Gas",
    "name": "Heat & Power",
    "unit": "Ccf",
    "points": generate_points(1, 200, 3),
}

steam_1 = {
    "device_type": "Steam",
    "name": "Generator",
    "unit": "lb",
    "points": generate_points(1, 600, 3),
}

building_data_1 = {
    "electric": [electric_1, electric_2, meter],
    "gas": [gas_1],
    "steam": [steam_1],
}

building_data_electric = {
    "electric": [electric_1, electric_2],
}

building_data_gas = {
    "gas": [gas_1],
}

building_data_steam = {
    "steam": [steam_1],
}
