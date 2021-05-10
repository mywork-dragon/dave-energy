# type: ignore
from datetime import datetime, timedelta
import pandas as pd
import pytz
from typing import Any, Dict, Tuple

from app import app, db

from common.constants import (
    DCM_ACCEPTABLE_GROWTH,
    DCM_IMMEDIATE_THRESHOLD,
    DCM_LOOKBACK_HOURS,
    DCM_WARNING_THRESHOLD,
)
from models.billing_peak import BillingPeak
from models.building import Building
from models.asset import Asset
from models.history import History
from models.point import Point


def dcm_events(
    electricity_data: pd.DataFrame, current_period: datetime, constants: Dict[str, Any]
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    # Calculate start and end time period
    end_time_period = current_period
    start_time_period = end_time_period - timedelta(
        hours=constants["Interval - Lookback"]
    )
    _interval_period = 15  # mins

    # Segment data
    segment_elec_data = electricity_data.loc[
        (electricity_data.index >= start_time_period)
        & (electricity_data.index <= end_time_period),
        :,
    ]

    # Create columns
    segment_elec_data.loc[
        start_time_period:end_time_period, "Max Threshold (kW)"
    ] = constants["DCM Threshold"]
    segment_elec_data.loc[
        start_time_period:end_time_period, "Immediate Threshold (kW)"
    ] = (constants["DCM Threshold"] * constants["Threshold % - Immediate"])
    segment_elec_data.loc[
        start_time_period:end_time_period, "Warning Threshold (kW)"
    ] = (constants["DCM Threshold"] * constants["Threshold % - Warning"])
    segment_elec_data.loc[start_time_period:end_time_period, "Power - % Change"] = 0
    segment_elec_data.loc[start_time_period:end_time_period, "DCM - Warning"] = 0
    segment_elec_data.loc[start_time_period:end_time_period, "DCM - Immediate"] = 0
    segment_elec_data.loc[start_time_period:end_time_period, "DCM - Combined"] = 0

    # Calculate Percent Change of Load
    segment_elec_data.loc[
        start_time_period:end_time_period, "Power - % Change"
    ] = segment_elec_data.loc[start_time_period:end_time_period, "kW"].pct_change()

    # If % change above acceptable rate, and minimum threshold hit, then Warning DCM signal
    segment_elec_data.loc[
        (segment_elec_data["Power - % Change"] >= constants["Acceptable Growth %"])
        & (
            segment_elec_data["kW"]
            >= constants["Threshold % - Warning"] * constants["DCM Threshold"]
        ),
        "DCM - Warning",
    ] = 1

    # If meter (kW) above immediate threshold range, then Immediate DCM signals
    segment_elec_data.loc[
        (
            segment_elec_data["kW"]
            >= constants["DCM Threshold"] * constants["Threshold % - Immediate"]
        ),
        "DCM - Immediate",
    ] = 1

    # If warning and immediate signals, then trigger
    segment_elec_data.loc[
        (segment_elec_data["DCM - Warning"] == 1)
        & (segment_elec_data["DCM - Immediate"] == 1),
        "DCM - Combined",
    ] = 1

    # Create event dataframe
    _data = [
        [
            end_time_period,
            end_time_period + timedelta(minutes=_interval_period),
            segment_elec_data[-1:]["DCM - Immediate"][0],
            segment_elec_data[-1:]["DCM - Warning"][0],
            segment_elec_data[-1:]["DCM - Combined"][0],
        ]
    ]
    # at this point, datetimes are actually in UTC yet, converted to EST later in the code
    final_events = pd.DataFrame(
        _data,
        columns=[
            "Start Time (EST)",
            "End Time (EST)",
            "DCM - Immediate",
            "DCM - Warning",
            "DCM - Combined",
        ],
    )

    return final_events, segment_elec_data


def handle_pandas_tz(pd_timestamp: int) -> datetime:
    """Convert pandas timestamp into datetime, localize as current TZ

    and then convert to UTC."""
    pd_datetime = datetime.fromtimestamp(pd_timestamp / 1000)
    pd_datetime = pd_datetime.astimezone().astimezone(pytz.utc)
    return pd_datetime


def new_model() -> Tuple[str, int]:
    pd.options.mode.chained_assignment = None
    curr_time = datetime.utcnow()
    # TODO debug, cleanup
    # curr_time = datetime(2020, 8, 10, 10, 1, 0)  # immediate signal

    constants = {}
    # Preset constants for 3000 Atrium (add to a config file?)
    constants["Threshold % - Immediate"] = DCM_IMMEDIATE_THRESHOLD
    constants["Threshold % - Warning"] = DCM_WARNING_THRESHOLD
    constants["Acceptable Growth %"] = DCM_ACCEPTABLE_GROWTH
    constants["Interval - Lookback"] = DCM_LOOKBACK_HOURS

    from_time = curr_time - timedelta(
        hours=constants["Interval - Lookback"], minutes=10
    )
    to_time = curr_time
    # from_time = datetime(2020, 8, 9, 4, 0, 0)
    # to_time = datetime(2020, 8, 13, 4, 0, 0)

    building = Building.get_building_by_name("S.~33000Atrium")
    billing_peak = BillingPeak.get_billing_peaks(building.id, from_time, to_time)[0]
    # Can be obtained from day-ahead schedule, or preset
    constants["DCM Threshold"] = billing_peak.peak_value

    # need to get history for a point ordered by ts,
    # so that final result looks like:
    #                           id  quantity
    # ts
    # 2020-08-05 04:00:00  3115642   71.6924
    # 2020-08-05 04:15:00  3115643   65.8605
    device = Asset.get_asset_by_name("3000 Atruim N4")
    point_id = Point.get_device_main_meter_point(device.id).id
    # point_id = 415  # Atrium's meter point

    history = History.get_history(point_id, from_time, to_time)

    hist_dicts = []
    for hs in history:
        hist_dicts.append({"ts": hs.ts, "kW": hs.quantity})
    if not hist_dicts:
        # no history data
        return "[]", point_id
    _elec_data_pd = pd.DataFrame.from_dict(hist_dicts)

    _elec_data_pd["ts"] = pd.to_datetime(_elec_data_pd["ts"])
    _elec_data_pd["ts"] = _elec_data_pd["ts"].astype("datetime64[s]")
    _elec_data_pd = _elec_data_pd.set_index(_elec_data_pd["ts"])
    _elec_data_pd = _elec_data_pd.drop("ts", 1)
    _elec_data_pd.index = _elec_data_pd.index.round("T")

    _elec_data_pd = _elec_data_pd.loc["2019-08-12 04:00:00":, :]  # what does it do?
    _elec_data_pd = _elec_data_pd.astype(float)

    # Inputs for dcm_events():
    # _elec_data_pd: is the historical real-time 15-minute data. index = datetetime, column ( labeled with column 'kW') is energy usage from meter
    # current_period: is the period we want to predict. For example, if we want to predict for 13:15, we would enter a datetime object as follows:
    # datetime(2020, 9, 4, 13, 15, 0)
    # Notes: we must ensure the previous period (15-min) meter read is available. So for most accuracy, we need the meter read from 09-04-2020 13:00:00.
    # Notes: Best to run this model after that data is available and before the current period, 09-04-2020 13:05:00

    current_period = curr_time
    final_events, segment_elec_data = dcm_events(
        _elec_data_pd, current_period, constants
    )
    return final_events.to_json(orient="index"), point_id
