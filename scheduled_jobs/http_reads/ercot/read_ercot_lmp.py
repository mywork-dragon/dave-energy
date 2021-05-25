
from datetime import datetime

from scheduled_jobs.http_reads.lmp import LMP
from scheduled_jobs.trulight_energy.reference_data import ReferenceData


DT_FORMAT = "%m/%d/%Y"

def get_instance(row_dicts, is_real_time):
    if len(row_dicts) != 4:
        raise Exception("ERCOT has 15 min interval data, we save for the hr. We need 4 rows for the hour to create a LMP instance")

    zone_name = row_dicts[0]["Settlement Point Name"].lower()
    zone_id = ReferenceData.get_instance().get_zone_id(zone_name)
    if not zone_id:
        return None

    dt_delivery = datetime.strptime(row_dicts[0]["Delivery Date"], DT_FORMAT)
    delivery_hr = row_dicts[0]["Delivery Hour"]
    # Find the average of the settle price for the hr
    settlement_price = 0
    for row_dict in row_dicts:
        if delivery_hr != row_dict["Delivery Hour"]:
            raise Exception("Delivery hour mismatch.")
        settlement_price += float(row_dict["Settlement Point Price"])
    settlement_price = round((settlement_price / 4), 2)
    
    return LMP(dt_delivery, settlement_price, is_real_time, int(float(delivery_hr)), zone_id, zone_name)


# if __name__ == "__main__":
#     run()