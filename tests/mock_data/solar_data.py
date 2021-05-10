# type:ignore

# Solar values from client
solar_power_data = {
    "data": {
        "power": {
            "timeUnit": "QUARTER_OF_AN_HOUR",
            "unit": "W",
            "measuredBy": "METER",
            "values": [
                {"date": "2020-05-18 11:30:00", "value": 0.0},
                {"date": "2020-05-18 11:45:00", "value": 0.0},
                {"date": "2020-05-18 12:00:00", "value": 0.0},
            ],
        }
    }
}


def get_solar_power_return(point_id):
    return [
        {"point_id": point_id, "ts": "2020-05-18 15:30:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-18 15:45:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-18 16:00:00", "quantity": 0.0,},
    ]


solar_energy_data = {
    "data": {
        "energy": {
            "timeUnit": "QUARTER_OF_AN_HOUR",
            "unit": "Wh",
            "measuredBy": "METER",
            "values": [
                {"date": "2020-05-17 00:00:00", "value": 0.0},
                {"date": "2020-05-17 00:15:00", "value": 0.0},
                {"date": "2020-05-17 00:30:00", "value": 0.0},
                {"date": "2020-05-17 00:45:00", "value": 0.0},
                {"date": "2020-05-17 01:00:00", "value": 0.0},
                {"date": "2020-05-17 01:15:00", "value": 0.0},
                {"date": "2020-05-17 01:30:00", "value": 0.0},
                {"date": "2020-05-17 01:45:00", "value": 0.0},
                {"date": "2020-05-17 02:00:00", "value": 0.0},
                {"date": "2020-05-17 02:15:00", "value": 0.0},
                {"date": "2020-05-17 02:30:00", "value": 0.0},
                {"date": "2020-05-17 02:45:00", "value": 0.0},
                {"date": "2020-05-17 03:00:00", "value": 0.0},
                {"date": "2020-05-17 03:15:00", "value": 0.0},
                {"date": "2020-05-17 03:30:00", "value": 0.0},
                {"date": "2020-05-17 03:45:00", "value": 0.0},
                {"date": "2020-05-17 04:00:00", "value": 0.0},
            ],
        }
    }
}


def get_solar_energy_return(point_id):
    return [
        {"point_id": point_id, "ts": "2020-05-17 04:00:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 04:15:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 04:30:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 04:45:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 05:00:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 05:15:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 05:30:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 05:45:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 06:00:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 06:15:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 06:30:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 06:45:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 07:00:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 07:15:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 07:30:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 07:45:00", "quantity": 0.0,},
        {"point_id": point_id, "ts": "2020-05-17 08:00:00", "quantity": 0.0,},
    ]


solar_inventory_data = {
    "data": {
        "Inventory": {
            "meters": [
                {
                    "name": "Production Meter",
                    "manufacturer": "WattNode",
                    "model": "RWND-3D-480-MB",
                    "firmwareVersion": "25",
                    "connectedTo": "Inverter 12",
                    "connectedSolaredgeDeviceSN": "7E142D70-2F",
                    "type": "Production",
                    "form": "physical",
                    "SN": "4163567",
                }
            ],
            "sensors": [],
            "gateways": [],
            "batteries": [],
            "inverters": [
                {
                    "name": "Inverter 2",
                    "manufacturer": "SolarEdge",
                    "model": "SE33.3K-USR48NNU4",
                    "dsp1Version": "1.13.1031",
                    "dsp2Version": "2.19.922",
                    "cpuVersion": "3.2221.0",
                    "SN": "7E142D69-28",
                    "connectedOptimizers": 148,
                }
            ],
        }
    }
}

solar_inventory_inverter_return = [
    {"name": "Inverter2", "serial_number": "7E142D69-28"}
]

solar_inverter_data = {
    "data": {
        "data": {
            "count": 2,
            "telemetries": [
                {
                    "date": "2020-01-10 11:04:48",
                    "totalActivePower": 0.0,
                    "dcVoltage": 19.5625,
                    "powerLimit": 100.0,
                    "totalEnergy": 237832.0,
                    "temperature": 0.0,
                    "inverterMode": "LOCKED_STANDBY",
                    "operationMode": 0,
                    "vL1To2": 467.031,
                    "vL2To3": 464.312,
                    "vL3To1": 465.875,
                    "L1Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 269.188,
                        "acFrequency": 59.9999,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                    "L2Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 269.594,
                        "acFrequency": 60.0007,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                    "L3Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 268.094,
                        "acFrequency": 60.0013,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                },
                {
                    "date": "2020-01-10 11:09:48",
                    "totalActivePower": 0.0,
                    "dcVoltage": 19.5625,
                    "powerLimit": 100.0,
                    "totalEnergy": 237832.0,
                    "temperature": 0.0,
                    "inverterMode": "LOCKED_STANDBY",
                    "operationMode": 0,
                    "vL1To2": 468.125,
                    "vL2To3": 465.781,
                    "vL3To1": 466.875,
                    "L1Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 269.703,
                        "acFrequency": 59.9899,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                    "L2Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 270.344,
                        "acFrequency": 59.9923,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                    "L3Data": {
                        "acCurrent": 0.0,
                        "acVoltage": 268.922,
                        "acFrequency": 59.9935,
                        "apparentPower": 0.0,
                        "activePower": 0.0,
                        "reactivePower": 0.0,
                        "cosPhi": 0.0,
                    },
                },
            ],
        }
    }
}


def get_solar_inverter_return(
    point_inverterid,
    point_operationid,
    point_l1currentid,
    point_l1voltageid,
    point_l1frequencyid,
    point_l1cosphiid,
    point_l1apparentpowerid,
    point_l2currentid,
    point_l2voltageid,
    point_l2frequencyid,
    point_l2cosphiid,
    point_l2apparentpowerid,
    point_l3currentid,
    point_l3voltageid,
    point_l3frequencyid,
    point_l3cosphi,
    point_l3apparentpowerid,
):
    return {
        "inverterMode": [
            {
                "point_id": point_inverterid,
                "ts": "2020-01-10 16:04:48",
                "quantity": None,
                "mode": "LOCKED_STANDBY",
            },
            {
                "point_id": point_inverterid,
                "ts": "2020-01-10 16:09:48",
                "quantity": None,
                "mode": "LOCKED_STANDBY",
            },
        ],
        "operationMode": [
            {
                "point_id": point_operationid,
                "ts": "2020-01-10 16:04:48",
                "quantity": None,
                "mode": "0",
            },
            {
                "point_id": point_operationid,
                "ts": "2020-01-10 16:09:48",
                "quantity": None,
                "mode": "0",
            },
        ],
        "L1Current": [
            {
                "point_id": point_l1currentid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l1currentid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L1Voltage": [
            {
                "point_id": point_l1voltageid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 269.188,
                "mode": None,
            },
            {
                "point_id": point_l1voltageid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 269.703,
                "mode": None,
            },
        ],
        "L1Frequency": [
            {
                "point_id": point_l1frequencyid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 59.9999,
                "mode": None,
            },
            {
                "point_id": point_l1frequencyid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 59.9899,
                "mode": None,
            },
        ],
        "L1cosPhi": [
            {
                "point_id": point_l1cosphiid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l1cosphiid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L1apparentPower": [
            {
                "point_id": point_l1apparentpowerid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l1apparentpowerid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L2Current": [
            {
                "point_id": point_l2currentid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l2currentid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L2Voltage": [
            {
                "point_id": point_l2voltageid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 269.594,
                "mode": None,
            },
            {
                "point_id": point_l2voltageid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 270.344,
                "mode": None,
            },
        ],
        "L2Frequency": [
            {
                "point_id": point_l2frequencyid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 60.0007,
                "mode": None,
            },
            {
                "point_id": point_l2frequencyid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 59.9923,
                "mode": None,
            },
        ],
        "L2cosPhi": [
            {
                "point_id": point_l2cosphiid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l2cosphiid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L2apparentPower": [
            {
                "point_id": point_l2apparentpowerid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l2apparentpowerid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L3Current": [
            {
                "point_id": point_l3currentid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l3currentid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L3Voltage": [
            {
                "point_id": point_l3voltageid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 268.094,
                "mode": None,
            },
            {
                "point_id": point_l3voltageid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 268.922,
                "mode": None,
            },
        ],
        "L3Frequency": [
            {
                "point_id": point_l3frequencyid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 60.0013,
                "mode": None,
            },
            {
                "point_id": point_l3frequencyid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 59.9935,
                "mode": None,
            },
        ],
        "L3cosPhi": [
            {
                "point_id": point_l3cosphi,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l3cosphi,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
        "L3apparentPower": [
            {
                "point_id": point_l3apparentpowerid,
                "ts": "2020-01-10 16:04:48",
                "quantity": 0.0,
                "mode": None,
            },
            {
                "point_id": point_l3apparentpowerid,
                "ts": "2020-01-10 16:09:48",
                "quantity": 0.0,
                "mode": None,
            },
        ],
    }
