
from scheduled_jobs.trulight_energy.run import run
from scheduled_jobs.trulight_energy.run import TrulightAPIType

FORWARD_CURVE_COB_URL = "/api/ForwardCurve/cob"


if __name__ == "__main__":
    run(FORWARD_CURVE_COB_URL, TrulightAPIType.Forward)