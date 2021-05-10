# type: ignore
import getopt
import sys

from config import logger
from common.constants import MONTH_DISPLAY
from models.energy_star import EnergyStar


if __name__ == "__main__":
    """
    create energy star data using command line.

    example:

    PYTHONPATH=./ FLASK_ENV=development pipenv run python scripts/create_energy_star_data.py --month="01" --year="2020"
                --score="65" --building_id=5

    NOTE: month is an is an optional args. Do not pass month if you want to insert same score for all month in year.
    """
    try:
        opts, args = getopt.getopt(
            sys.argv[1:], "", ["month=", "year=", "score=", "building_id="]
        )
    except getopt.GetoptError:
        logger.info(
            "create_energy_star_data.py --month=MM --year=YYYY --score=10 --building_id=5"
        )
        sys.exit(2)
    month = year = score = building_id = None
    for opt, arg in opts:
        if opt == "--month":
            month = arg
        elif opt == "--year":
            year = arg
        elif opt == "--building_id":
            building_id = arg
        elif opt == "--score":
            score = arg

    if not year or not building_id or not score:
        logger.info("year, building_id and score are mandatory field")
        sys.exit(2)

    logger.info("creating data for energy_star")
    try:
        month_list = []
        if not month:
            month_list = MONTH_DISPLAY.keys()
        else:
            month_list.append(month)
        data = []
        for month_value in month_list:
            data.append(
                dict(
                    building_id=int(building_id),
                    month=month_score,
                    year=year,
                    score=int(score),
                )
            )
        EnergyStar.create_energy_star(data)
    except ValueError:
        logger.info(
            f"Please provide as mentioned: building_id: int, year:int, month: str like 01, 02 etc. and score: int"
        )
    logger.info(f"Data created for energy star")
