# type: ignore
import getopt
import sys

import hszinc

from config import logger
from common.utils import str_to_bool
from services.niagara4_service import change_mode


if __name__ == "__main__":

    """
    Update dispatch status using the command line

    example:

    PYTHONPATH=./ FLASK_ENV=development pipenv run python scripts/update_dispatch_status.py --entity=<entity name> --value=<value>
    """
    try:
        opts, args = getopt.getopt(sys.argv[1:], "", ["entity=", "value="])
    except getopt.GetoptError:
        logger.info("update_dispatch_status.py --entity=<entity name> --value=<value>")
        sys.exit(2)

    entity = value = None

    for opt, arg in opts:
        if opt == "--entity":
            entity = arg
        elif opt == "--value":
            value = arg

    if not (entity and value):
        logger.info("Please provide entity and value in proper format")
        sys.exit(2)

    # TODO: Need to update for handling float values
    value = str_to_bool(value)

    logger.info("Updating Entity Mode/Value")
    changed = change_mode(entity, value)
    if not isinstance(changed, hszinc.grid.Grid):
        logger.info(
            f"Failed to update entity '{entity}' mode/value to {value}, please check logs for more info."
        )
    else:
        logger.info(f"Entity '{entity}' mode/value updated to {value}")
