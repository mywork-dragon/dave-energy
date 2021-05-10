

from data.db_energy_curves_connection import DBEnergyCurvesConnection

class ReferenceData:

    instance = None
    def __init__(self):
        if not ReferenceData.instance is None:
            raise Exception('ReferenceData is supposed to be instantiated only once. Please use get_instance() for accessing the Singleton.')
            
        self.zone_name_to_id = {}
        self.iso_name_to_iso = {}
        self.time_bucket_to_id = {}
        self.unit_symbol_to_id = {}

        with DBEnergyCurvesConnection() as conn:
            sql = "select id, name from zone"
            for rec in conn.select_dict(sql):
                self.zone_name_to_id[rec["name"].lower()] = rec["id"]
            
            sql = "select id, name, time_bucket_format_id from iso"
            for rec in conn.select_dict(sql):
                self.iso_name_to_iso[rec["name"].lower()] = {
                    "id": rec["id"],
                    "name": rec["name"],
                    "time_bucket_format_id": rec["time_bucket_format_id"]
                }
            
            sql = "select id, name from time_bucket"
            for rec in conn.select_dict(sql):
                self.time_bucket_to_id[rec["name"].lower()] = rec["id"]

            sql = "select id, symbol from unit"
            for rec in conn.select_dict(sql):
                self.unit_symbol_to_id[rec["symbol"].lower()] = rec["id"]
    

    def get_zone_id(self, zone_name: str):
        if zone_name in self.zone_name_to_id:
            return self.zone_name_to_id[zone_name]
        return None


    def get_iso(self, iso_name: str):
        if iso_name in self.iso_name_to_iso:
            return self.iso_name_to_iso[iso_name]
        return None


    def get_time_bucket_id(self, time_bucket_name: str):
        if time_bucket_name in self.time_bucket_to_id:
            return self.time_bucket_to_id[time_bucket_name]
        return None


    def get_unit_id(self, unit_symbol: str):
        unit_symbol = unit_symbol.lower()
        for symbol, id in self.unit_symbol_to_id.items():
            if symbol.lower() == unit_symbol:
                return id
        return None


    def get_date_time_bucket_id(self, timestamp, time_bucket_id, time_bucket_format_id):
        with DBEnergyCurvesConnection() as conn:
            sql = """select id 
                from date_time_bucket 
                where time_bucket_format_id = %s
                and time_bucket_id = %s
                and dt = %s
                and hr_ending = %s
                """
            recs = conn.select_dict(sql, [time_bucket_format_id, time_bucket_id, timestamp.date(), timestamp.hour])
            if recs:
                return recs[0]["id"]
            
            return None


    @staticmethod
    def get_instance():
        if ReferenceData.instance is None:
            ReferenceData.instance = ReferenceData()

        return ReferenceData.instance