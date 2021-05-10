
from scheduled_jobs.trulight_energy.run import run
from scheduled_jobs.trulight_energy.run import TrulightAPIType

FORWARD_CURVE_MORNING_URL = "/api/ForwardCurve/morning"


if __name__ == "__main__":
    run(FORWARD_CURVE_MORNING_URL, TrulightAPIType.Forward)