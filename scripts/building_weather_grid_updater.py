#!/usr/bin/env python

import argparse
import logging
import requests
from app import db
from models.building import Building
from models.company import Company
from models.weather_gov_station_grid import WeatherGovStationGrid
from models.weather_station import WeatherStation, WeatherStationType
from typing import Dict, Optional


GEOCODER_BASE_URL = (
    "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address="
)
GEOCODER_FORMAT_URL_SUFFIX = "&benchmark=PUBLIC_AR_Current&format=JSON"
WEATHER_GOV_POINT_BASE_URL = "https://api.weather.gov/points/"
WEATHER_GOV_OFFICE_BASE_URL = "https://api.weather.gov/offices/"
STATION_TYPE = WeatherStationType.WEATHER_GOV


def get_weather_station_name_and_grid_from_address(address: str) -> Dict[str, str]:
    resp = requests.get(
        "{0}{1}{2}".format(GEOCODER_BASE_URL, address, GEOCODER_FORMAT_URL_SUFFIX)
    )
    lat = resp.json()["result"]["addressMatches"][0]["coordinates"]["y"]
    lon = resp.json()["result"]["addressMatches"][0]["coordinates"]["x"]

    resp = requests.get("{0}{1},{2}".format(WEATHER_GOV_POINT_BASE_URL, lat, lon))
    station_name = resp.json()["properties"]["cwa"]
    gridx = resp.json()["properties"]["gridX"]
    gridy = resp.json()["properties"]["gridY"]

    return {
        "station_name": station_name,
        "gridx": gridx,
        "gridy": gridy,
    }


def update_building_with_weather_grid_id(building: Building) -> Optional[int]:
    # GeoCode and Lookup Station info for address
    addr = "{0}, {1}".format(building.address, building.zipcode)
    stn_grid_dict = get_weather_station_name_and_grid_from_address(addr)
    station_name = stn_grid_dict["station_name"]
    gridx = stn_grid_dict["gridx"]
    gridy = stn_grid_dict["gridy"]
    # Lookup station, if station doesn't exist, fail out
    weather_station = WeatherStation.query.filter_by(
        name=station_name, station_type=STATION_TYPE
    ).first()
    weather_gov_station_grid = WeatherGovStationGrid.query.filter_by(
        weather_station_id=weather_station.id,
        gridx=gridx,
        gridy=gridy,
    ).first()
    # If weather_gov_stn_grid doesn't exist, create it
    if not weather_gov_station_grid:
        grid = WeatherGovStationGrid(
            weather_station_id=weather_station.id, gridx=gridx, gridy=gridy
        )
        db.session.add(grid)
        db.session.commit()
        weather_gov_station_grid = (
            weather_gov_station_grid
        ) = WeatherGovStationGrid.query.filter_by(
            weather_station_id=weather_station.id,
            gridx=gridx,
            gridy=gridy,
        ).first()
        logging.info(
            "Created: weather_gov_station_grid id:{}, station_name:{}",
            weather_gov_station_grid.grid,
        )
    # Update Grid ID
    building.weather_gov_station_grid = weather_gov_station_grid.id
    db.session.commit()
    return int(weather_gov_station_grid.id)


def run(building_id: Optional[int]) -> None:
    buildings = (
        Building.query.filter_by(id=building_id).first()
        if building_id
        else Building.query.filter(Building.status == 1)
        .join(Company, Building.company_id == Company.id)
        .filter(Company.status == 1)
        .all()
    )
    for building in buildings:
        logging.info("Started: updating grid_id for building_id %s...", building.id)
        try:
            grid_id = update_building_with_weather_grid_id(building=building)
            if grid_id:
                logging.info(
                    "Completed: updated building_id %s with grid_id %i",
                    building.id,
                    grid_id,
                )
        except Exception:
            logging.exception(
                "Could not update grid_id for building_id %s:", building.id
            )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="""Updates gov_weather_station_grid_id for each building.
        weather_gov_station_grid entries are added as necessary"""
    )
    parser.add_argument(
        "-b",
        "--building_id",
        help="""Specifies building_id update
        omit argument to update all buildings of status 1 with company status 1""",
    )

    args = parser.parse_args()
    run(args.building_id)
