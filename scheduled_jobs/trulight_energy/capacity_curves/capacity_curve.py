
from datetime import datetime
from decimal import Decimal

from scheduled_jobs.trulight_energy.reference_data import ReferenceData
from scheduled_jobs.trulight_energy.trulight_curve import TrulightCurve


class CapacityCurve(TrulightCurve):

    def __init__(self, utc_computed, dt_forward, zone_id, unit_id, price, compliance_year, curve_type_id):
        self.utc_computed = utc_computed
        self.dt_forward = dt_forward
        self.zone_id = zone_id
        self.unit_id = unit_id
        self.price = price
        
        self.compliance_year = compliance_year
        self.curve_type_id = curve_type_id

    
    @staticmethod
    def get_instance(json_curve):
        dt_forward = datetime.strptime(json_curve["forwardDate"], "%Y-%m-%dT%H:%M:%S")
        utc_computed = datetime.strptime(json_curve["curveDateTime"], "%Y-%m-%dT%H:%M:%SZ")
        iso_name = json_curve["iso"].lower()
        
        zone_name = json_curve["zone"].lower()
        zone_id = TrulightCurve.get_zone_id(zone_name)
        if not zone_id:
            print("Zone does not exist: {}".format(zone_name))
            return None

        unit_name = json_curve["uom"].lower()
        if unit_name == "kw-mo":
            unit_name = "$/kw-mo"
        unit_id = ReferenceData.get_instance().get_unit_id(unit_name)

        price = float(json_curve["price"])
        compliance_year = CapacityCurve.get_compliance_year(iso_name, dt_forward)
        # TODO: Read from constants
        curve_type_id = 2

        return CapacityCurve(utc_computed, dt_forward, zone_id, unit_id, price,
                              compliance_year, curve_type_id)


    @staticmethod
    def get_compliance_year(iso_name, dt_forward):
        if iso_name.lower() == "nyiso":
            if dt_forward.month <= 4:
                return dt_forward.year - 1
            else:
                return dt_forward.year
        else:
            raise Exception("Compliance year is not setup for ISO: {}".format(iso_name))