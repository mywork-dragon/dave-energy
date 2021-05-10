
from scheduled_jobs.trulight_energy.reference_data import ReferenceData


Trulight_To_DE = {
    "south zone": "lz_south",
    "houston zone": "lz_houston",
    "north zone": "lz_north",
    "west zone": "lz_west"
}


class TrulightCurve:

    @staticmethod
    def get_zone_id(zone_name):
        if zone_name in Trulight_To_DE:
            zone_name = Trulight_To_DE[zone_name]
        return ReferenceData.get_instance().get_zone_id(zone_name)


