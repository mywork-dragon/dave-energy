
from datetime import datetime
from enum import Enum
import pytz

from data.db_energy_curves_connection import DBEnergyCurvesConnection
from scheduled_jobs.trulight_energy.capacity_curves.capacity_curve import CapacityCurve


class PersistCapacityCurves:

    ISOs_OF_INTEREST = ["nyiso"]
    def persist(self, energy_curves_json):
        print("Found {} foward curves, persisting them.".format(len(energy_curves_json)))
        with DBEnergyCurvesConnection() as conn:
            for json_curve in energy_curves_json:
                if not json_curve["iso"].lower() in PersistCapacityCurves.ISOs_OF_INTEREST:
                    continue

                # Translate to list of objects
                capacity_curve = CapacityCurve.get_instance(json_curve)
                if not capacity_curve:
                    print("Skipping: {}".format(json_curve))
                    continue
    
                print(json_curve)
                
                # Persist the list
                _now = datetime.utcnow()
                sql = """insert into non_energy_curve(utc_computed, dt_forward, price, compliance_year,
                                                      zone_id, unit_id, curve_type_id, utc_create)
                    values (%s, %s, %s, %s,
                            %s, %s, %s, %s)
                    ON CONFLICT (utc_computed, dt_forward, curve_type_id, zone_id)
                    DO NOTHING
                    """
                conn.execute(sql, [capacity_curve.utc_computed, capacity_curve.dt_forward,
                                   capacity_curve.price, capacity_curve.compliance_year,
                                   capacity_curve.zone_id, capacity_curve.unit_id,
                                   capacity_curve.curve_type_id, _now])
        print("Completed persisting capacity curves.")
        