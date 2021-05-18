
from datetime import datetime
from decimal import Decimal

from scheduled_jobs.trulight_energy.reference_data import ReferenceData
from scheduled_jobs.trulight_energy.trulight_curve import TrulightCurve


class EnergyCurve(TrulightCurve):

    def __init__(self, iso_id, zone_id, time_bucket_id, offer_price, mid_price, dt_forward_curve,
                 utc_computed, iso_name):
        self.iso_id = iso_id
        self.zone_id = zone_id
        self.time_bucket_id = time_bucket_id

        self.offer = offer_price
        self.mid = mid_price
        self.dt_forward_curve = dt_forward_curve
        self.utc_computed = utc_computed

        iso_name = iso_name.upper()
        self.is_real_time = iso_name == "ERCOT"
        self.is_financial = iso_name != "ERCOT"

    
    @staticmethod
    def get_instance(json_curve):
        iso_name = json_curve["iso"].lower()
        iso = ReferenceData.get_instance().get_iso(iso_name)
        if not iso:
            print("ISO does not exist: {}".format(iso_name))
            return None
        
        zone_name = json_curve["zone"].lower()
        zone_id = TrulightCurve.get_zone_id(zone_name)
        if not zone_id:
            print("Zone does not exist: {}".format(zone_name))
            return None

        strip_name = json_curve["strip"].lower()
        time_bucket_id = ReferenceData.get_instance().get_time_bucket_id(strip_name)
        if not time_bucket_id:
            print("Time bucket does not exist: {}".format(strip_name))
            return None
        
        dt_forward_curve = datetime.strptime(json_curve["forwardDate"], "%Y-%m-%dT%H:%M:%S")
        utc_computed = datetime.strptime(json_curve["curveDateTime"], "%Y-%m-%dT%H:%M:%SZ")
        offer_price = float(json_curve["offer"])
        mid_price = float(json_curve["mid"])

        return EnergyCurve(iso["id"], zone_id, time_bucket_id, offer_price, mid_price,
                           dt_forward_curve, utc_computed, iso_name)
