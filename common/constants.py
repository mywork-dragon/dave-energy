from enum import Enum


class AssetTypes(Enum):
    HVAC = "HVAC"
    METER = "Meter"
    OTHER = "Other"
    LIGHT = "Light"
    SOLAR = "Solar"
    BATTERY = "Battery"
    ELEVATOR = "Elevator"

class EnergyTypes(Enum):
    Electric = "electric"
    Gas = "gas"
    Steam = "steam"


STATUS_SUCCESS = "SUCCESS"

STATUS_FAIL = "FAIL"

N4_ROUTE_ERROR_MESSAGE = (
    "Unable to set value. Please check the entity and parameters passed."
)
N4_TIMEOUT = 60  # seconds

POWER_USAGE_UNIT = "KW"

# event status
COMPLETE = "Completed"
IN_ACTION = "In Action"
NEXT = "Next"

ENERGY_TYPES = {"electric": "Electricity", "steam": "Steam", "gas": "Gas"}
TIME_DIFFERENCE = 15  # minutes

ADMIN_DATETIME_FORMAT = "%m.%d.%Y %I:%M %p"
DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"
DATETIME_FORMAT2 = "%Y-%m-%dT%H:%M:%S.%fF"
FE_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f"
FE_DATETIME_FORMAT2 = "%Y-%m-%dT%H:%M:%S"
DATETIME_PM_FORMAT = "%Y/%m/%d %H:%M%p"
TZ_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f%z"

DATE_FORMAT = "%Y-%m-%d"

WATT_MULTIPLIER = 0.001
KWATT_MULTIPLIER = 1
OTHER_MULTIPLIER = 1

# greenhouse gas emissions per kWh
GHG_EMISSIONS_PER_KWH = 0.000346


# DCM model constants
DCM_IMMEDIATE_THRESHOLD = 0.95  # %, Emergency threshold range
DCM_WARNING_THRESHOLD = 0.90  # %, Warning threshold range
DCM_ACCEPTABLE_GROWTH = 0.01  # %, Maximum acceptable percent growth
# time, how many hours (NB not intervals) to look backwards for calculation
DCM_LOOKBACK_HOURS = 4

MONTH_DISPLAY = {
    "01": "J",
    "02": "F",
    "03": "M",
    "04": "A",
    "05": "M",
    "06": "J",
    "07": "J",
    "08": "A",
    "09": "S",
    "10": "O",
    "11": "N",
    "12": "D",
}

REDIS_EXPIRE = 600  # seconds

TEMPERATURE = "temp"
CLOUD_COVER = "cloud_cover"
