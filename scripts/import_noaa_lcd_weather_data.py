#!/usr/bin/env python

# This script imports data from NOAA LCD csv files into the DE DB
# NOAA LCD files are manually requested and downloaded

from app import db
from datetime import datetime
from data.db_connection import DBConnection
from models.weather_station import WeatherStation, WeatherStationType
from models.weather_history import WeatherHistory
from typing import Dict, Optional
import argparse
import csv
import logging
from pytz import timezone


REQUIRED_INPUT_FIELD_NAMES = [
    "DATE",
    "STATION",
    "HourlyDryBulbTemperature",
    "HourlyRelativeHumidity",
]
NOAA_DT_FORMAT = "%Y-%m-%dT%H:%M:%S"


def containsRequiredFields(row: Dict[str, str]) -> bool:
    for field in REQUIRED_INPUT_FIELD_NAMES:
        if not row[field]:
            return False
    return True


def run(path: str, use_local_db: bool = False) -> None:
    with open(path, "r") as inFile:
        reader = csv.DictReader(inFile)

        for field in REQUIRED_INPUT_FIELD_NAMES:
            if field not in reader.fieldnames:
                logging.error("Input file does not contain required column: %s", field)
                return None

        # Get starting count
        count: int = 0
        weather_station: Optional[WeatherStation] = None

        for row in reader:
            # Sometimes NOAA records rows with daily instead of hourly data, skip these rows
            if not containsRequiredFields(row):
                continue
            # Instantiate weather_station and count with first row data
            if not weather_station:
                station_name = "WBAN:{0}".format(row["STATION"][-5:])
                weather_station = WeatherStation.query.filter_by(
                    name=station_name, station_type=WeatherStationType.NOAA
                ).first()
                if not weather_station:
                    logging.warning("Weather Station %s does not exist", station_name)
                    return
                count = WeatherHistory.query.filter_by(
                    weather_station_id=weather_station.id
                ).count()
            utc_ts = (
                timezone(weather_station.timezone)
                .localize(datetime.strptime(row["DATE"], NOAA_DT_FORMAT))
                .astimezone(timezone("UTC"))
            )
            dry_temp_f = row["HourlyDryBulbTemperature"]
            humidity = row["HourlyRelativeHumidity"]
            sql = """INSERT INTO weather_history(weather_station_id, utc_ts, dry_temp_f, humidity)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT DO NOTHING;
            """
            with DBConnection(use_local_db) as conn:
                conn.execute(sql, [weather_station.id, utc_ts, dry_temp_f, humidity])

        if weather_station:
            count = (
                WeatherHistory.query.filter_by(
                    weather_station_id=weather_station.id
                ).count()
                - count
            )
            logging.info(
                "Imported %i new datapoints into weather_history for weather_station %s",
                count,
                weather_station.name,
            )
            return

        logging.warning("Input file contains no data to import")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Adds NOAA LCD data to weather_history table."
    )
    parser.add_argument(
        "input", type=str, nargs=1, help="Relative path to input datafile (.csv)"
    )
    parser.add_argument("-l", "--local", action="store_true", help="Use local DB")
    args = parser.parse_args()
    try:
        run(path=args.input[0], use_local_db=args.local)
    except StopIteration:
        logging.error("Input file contains no rows to import")
    except Exception as err:
        logging.exception(
            "Could not import data from file at relative path: %s", args.input[0]
        )
