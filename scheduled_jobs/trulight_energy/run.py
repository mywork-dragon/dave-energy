
import traceback

from enum import Enum

from config import logger
from common import slack
from scheduled_jobs.trulight_energy.forward_curves.persist_forward_curves import PersistForwardCurves
from scheduled_jobs.trulight_energy.capacity_curves.persist_capacity_curves import PersistCapacityCurves
from scheduled_jobs.trulight_energy.read_curves import ReadCurves

class TrulightAPIType(Enum):
    Forward = "Forward"
    Capacity = "Capacity"


def run(curve_url, trulight_api_type: TrulightAPIType):
    try:
        logger.info("Starting reading forward curves.")
        rc = ReadCurves()
        curves = rc.read(curve_url)
        logger.info("Reading curves completed, read {} prices.".format(len(curves)))

        if trulight_api_type == TrulightAPIType.Forward:
            logger.info("Persisting forward curves.")
            PersistForwardCurves().persist(curves)
            logger.info("Persisting forward curves completed.")
        elif trulight_api_type == TrulightAPIType.Capacity:
            logger.info("Persisting capacity curves.")
            PersistCapacityCurves().persist(curves)
            logger.info("Persisting capacity curves completed.")

    except:
        logger.error('Error while reading forward curves from Trulight Energy.')
        logger.error(traceback.format_exc())
        slack.send_alert('Error while reading forward curves from Trulight Energy.')
        slack.send_alert(traceback.format_exc())