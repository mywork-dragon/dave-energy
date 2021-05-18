
from datetime import datetime

from scheduled_jobs.http_reads.lmp import LMP
from scheduled_jobs.trulight_energy.reference_data import ReferenceData


DT_FORMAT = "%m/%d/%Y"

def get_instance(row_dict, is_real_time):
    if row_dict["H"] == "D":
        zone_name = row_dict["Location Name"].replace(".Z.", "")
        zone_name = zone_name.replace(".H.", "").lower()
        zone_id = ReferenceData.get_instance().get_zone_id(zone_name)
        if not zone_id:
            return None

        dt = datetime.strptime(row_dict["Date"], DT_FORMAT)
        hr_ending = int(row_dict["Hour Ending"])
        price = row_dict["Locational Marginal Price"]
        
        return LMP(dt, price, is_real_time, hr_ending, zone_id, zone_name)
    
    return None