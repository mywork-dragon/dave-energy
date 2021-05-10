
from scheduled_jobs.trulight_energy.run import run
from scheduled_jobs.trulight_energy.run import TrulightAPIType

CAPACITY_CURVE_URL = "/api/CapacityCurve/NyIso"


if __name__ == "__main__":
    run(CAPACITY_CURVE_URL, TrulightAPIType.Capacity)