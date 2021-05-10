
import csv

from data.db_connection import DBConnection


CSV_COL_HEADERS = ["BuildingId", "BuildingName", "Power", "UTC Computed", "UTC of Forecast"]

def run():
    with DBConnection() as conn:
        with open("dnv.csv", 'w') as csvfile:
            csvwriter = csv.writer(csvfile)
            csvwriter.writerow(CSV_COL_HEADERS)
            sql = """select df.building_id, bld.name, df.power, df.utc_computed, df.utc_forecast
                from dnv_forecast df
                    inner join building bld on df.building_id = bld.id
                """
            for rec in conn.select_dict(sql):
                csvwriter.writerow([rec["building_id"], rec["name"], rec["power"],
                                    rec["utc_computed"].strftime("%m/%d/%Y %H:%M:%S"),
                                    rec["utc_forecast"].strftime("%m/%d/%Y %H:%M:%S")
                                   ])


if __name__ == "__main__":
    run()