
from datetime import datetime
from enum import Enum
import pytz

from data.db_energy_curves_connection import DBEnergyCurvesConnection
from scheduled_jobs.trulight_energy.forward_curves.energy_curve import EnergyCurve


class PersistForwardCurves:

    def persist(self, energy_curves_json):
        print("Found {} foward curves, persisting them.".format(len(energy_curves_json)))
        with DBEnergyCurvesConnection() as conn:
            for json_curve in energy_curves_json:
                # Translate to list of objects
                energy_curve = EnergyCurve.get_instance(json_curve)
                if not energy_curve:
                    continue

                print(json_curve)
                print(energy_curve.iso_id, energy_curve.zone_id, energy_curve.time_bucket_id, energy_curve.mid,
                    energy_curve.offer, energy_curve.dt_forward_curve,
                    energy_curve.is_real_time, energy_curve.is_financial)
                
                # Persist the list
                _now = datetime.utcnow()
                sql = """insert into energy_curve(dt_forward, offer, mid,
                    is_financial, is_real_time, zone_id, time_bucket_id, utc_computed, utc_create)
                    values (%s, %s, %s,
                            %s, %s, %s,
                            %s, %s, %s)
                    ON CONFLICT (zone_id, time_bucket_id, dt_forward, utc_computed)
                    DO NOTHING
                    """
                conn.execute(sql, [energy_curve.dt_forward_curve.date(), energy_curve.offer, energy_curve.mid, 
                    energy_curve.is_financial, energy_curve.is_real_time, energy_curve.zone_id,
                    energy_curve.time_bucket_id, energy_curve.utc_computed, _now])
        print("Completed persisting forward curves.")