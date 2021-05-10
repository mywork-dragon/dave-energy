
from data.db_connection import DBConnection
from scheduled_jobs.niagara4.events.dcm_tomorrow_rising_peak import DCMTomorrowRisingPeak

def run():
    # Buildings for which recieve forecast data from DNV
    building_ids_with_forecast = []
    with DBConnection() as conn:
        sql = "select distinct building_id from dnv_forecast"
        for rec in conn.select_dict(sql):
            building_ids_with_forecast.append(rec["building_id"])

    dcm_for_tomorrow = DCMTomorrowRisingPeak()
    for building_id in building_ids_with_forecast:
        dcm_for_tomorrow.create_event(building_id)


if __name__ == "__main__":
    run()