# type: ignore

import calendar
from datetime import datetime

from app import app
from flask import jsonify, request
from typing import Any, Dict, Tuple

from controller.analytics_management.lcl_common import get_pct_diff
from controller.common_routes import get_current_user
from third_party.utility_api.utility_api_wrapper import UtilityApiWrapper
from models.building import Building
from normalization.temperature_normalization import TemperatureNormalization


@app.route("/analytics/cost-and-savings-chart", methods=["GET"])
def cost_and_savings_chart() -> Tuple[Dict[str, Any], int]:
    """
    Returns cost savings ytd for utilities consumed by the building by billing cycle
    """
    building_id = request.args.get('building_id')
    is_temperature_normalized = bool(int(request.args.get('is_temperature_normalized')))

    building = Building.query.filter_by(id=building_id).first()

    # Electricity
    resp = _get_electricity_chart_values("get_cost_ytd",
                                         "get_cost_by_cycle",
                                         building,
                                         "$",
                                         is_temperature_normalized)

    # Gas
    if building.consumes_gas:
        pass

    # Steam
    if building.consumes_steam:
        pass

    return resp, 200


@app.route("/analytics/energy-consumption-chart", methods=["GET"])
def energy_consumption_chart() -> Tuple[Dict[str, Any], int]:
    """
    Returns energy consumption of the building for billing cycles so far ytd
    """
    building_id = request.args.get('building_id')
    is_temperature_normalized = bool(int(request.args.get('is_temperature_normalized')))
    building = Building.query.filter_by(id=building_id).first()
    resp = _get_electricity_chart_values("get_energy_consumption_ytd",
                                         "get_energy_consumption_by_cycle",
                                         building,
                                         "kWh",
                                         is_temperature_normalized)

    # Gas
    if building.consumes_gas:
        pass

    # Steam
    if building.consumes_steam:
        pass

    return resp, 200


@app.route("/analytics/energy-demand-chart", methods=["GET"])
def energy_demand_chart() -> Tuple[Dict[str, Any], int]:
    """
    Returns energy demand of the building for the billing cycles so far ytd
    """
    building_id = request.args.get('building_id')
    is_temperature_normalized = bool(int(request.args.get('is_temperature_normalized')))
    building = Building.query.filter_by(id=building_id).first()

    resp = _get_electricity_chart_values("get_energy_demand_ytd",
                                         "get_energy_demand_by_cycle",
                                         building,
                                         "kW",
                                         is_temperature_normalized)

    return resp, 200


@app.route("/analytics/energy-usage-per-capita-chart", methods=["GET"])
def energy_usage_per_capita_chart() -> Tuple[Dict[str, Any], int]:
    """
    Returns energy usage per capita of the building for the billing cycles ytd
    """
    building_id = request.args.get('building_id')
    is_temperature_normalized = bool(int(request.args.get('is_temperature_normalized')))
    curr_year = datetime.now().year
    curr_month_name = calendar.month_name[datetime.now().month].upper()[:3]
    building = Building.query.filter_by(id=building_id).first()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    # Electricity
    ytd_curr_year = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])
    if ytd_curr_year is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        ytd_curr_year = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])
        curr_month_name = 'DEC'

    ytd_curr_year_display = 'NA'
    if ytd_curr_year:
        ytd_curr_year_display = f'{int(ytd_curr_year / building.occupancy):,}'

    ytd_last_year = utility_api_wrapper.get_energy_consumption_ytd(curr_year-1, [building_address])
    ytd_last_year_display = 'NA'
    if ytd_last_year:
        ytd_last_year_display = f'{int(ytd_last_year / building.occupancy):,}'

    pct_diff_display = '-'
    if ytd_curr_year and ytd_last_year:
        pct_diff = get_pct_diff(ytd_last_year, ytd_curr_year)
        pct_diff_display = str(pct_diff) + '%'

    month_to_values_curr_year = utility_api_wrapper.get_energy_consumption_by_cycle(curr_year, [building_address])
    month_to_values_last_year = utility_api_wrapper.get_energy_consumption_by_cycle(curr_year-1, [building_address])
    month_name_and_values = _merge_month_values(month_to_values_curr_year,
                                                month_to_values_last_year,
                                                curr_year,
                                                is_temperature_normalized,
                                                building.zipcode)
    for values in month_name_and_values:
        if values['curr_year']:
            values['curr_year'] = int(values['curr_year'] / building.occupancy)
        if values['last_year']:
            values['last_year'] = int(values['last_year'] / building.occupancy)

    curr_year_label, last_year_label = _ytd_labels(curr_year, curr_month_name)

    resp = {}
    resp['electricity'] = {
        'last_year': {
            'label': last_year_label,
            'value': ytd_last_year_display,
            'unit': 'kWh/capita'
        },
        'current_year': {
            'label': curr_year_label,
            'value': ytd_curr_year_display,
            'unit': 'kWh/capita',
            'year': curr_year
        },
        'pct_change': pct_diff_display,
        'month_and_values': month_name_and_values
    }

    # Gas
    if building.consumes_gas:
        pass

    # Steam
    if building.consumes_steam:
        pass

    return resp, 200


@app.route("/analytics/energy-cost-per-capita-chart", methods=["GET"])
def energy_cost_per_capita_chart() -> Tuple[Dict[str, Any], int]:
    """
    Returns energy cost per capita of the building for the billing cycles ytd
    """
    building_id = request.args.get('building_id')
    is_temperature_normalized = bool(int(request.args.get('is_temperature_normalized')))

    curr_year = datetime.now().year
    curr_month_name = calendar.month_name[datetime.now().month].upper()[:3]
    building = Building.query.filter_by(id=building_id).first()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    resp = {}
    # Electricity
    ytd_curr_year = utility_api_wrapper.get_cost_ytd(curr_year, [building_address])
    if ytd_curr_year is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_month_name = 'DEC'
        ytd_curr_year = utility_api_wrapper.get_cost_ytd(curr_year, [building_address])

    ytd_curr_year_display = 'NA'
    if ytd_curr_year:
        ytd_curr_year_display = f'{int(ytd_curr_year / building.occupancy):,}'

    ytd_last_year = utility_api_wrapper.get_cost_ytd(curr_year-1, [building_address])
    ytd_last_year_display = 'NA'
    if ytd_last_year:
        ytd_last_year_display = f'{int(ytd_last_year / building.occupancy):,}'

    pct_diff_display = '-'
    if ytd_curr_year and ytd_last_year:
        pct_diff = get_pct_diff(ytd_last_year, ytd_curr_year)
        pct_diff_display = str(pct_diff) + '%'

    month_to_values_curr_year = utility_api_wrapper.get_cost_by_cycle(curr_year, [building_address])
    month_to_values_last_year = utility_api_wrapper.get_cost_by_cycle(curr_year-1, [building_address])
    month_name_and_values = _merge_month_values(month_to_values_curr_year,
                                                month_to_values_last_year,
                                                curr_year,
                                                is_temperature_normalized,
                                                building.zipcode)
    for values in month_name_and_values:
        if values['curr_year']:
            values['curr_year'] = int(values['curr_year'] / building.occupancy)
        if values['last_year']:
            values['last_year'] = int(values['last_year'] / building.occupancy)


    curr_year_label, last_year_label = _ytd_labels(curr_year, curr_month_name)

    resp['electricity'] = {
        'last_year': {
            'label': last_year_label,
            'value': ytd_last_year_display,
            'unit': '$/capita'
        },
        'current_year': {
            'label': curr_year_label,
            'value': ytd_curr_year_display,
            'unit': '$/capita',
            'year': curr_year
        },
        'pct_change': pct_diff_display,
        'month_and_values': month_name_and_values
    }

    # Gas
    if building.consumes_gas:
        pass

    # Steam
    if building.consumes_steam:
        pass

    return resp, 200

def _get_electricity_chart_values(aggregate_func_name, chart_func_name, building, unit, is_temperature_normalized):
    # Puts together response of electricity for the specific page(Costs and Savings, Demand, Consumption, etc.)
    curr_year = datetime.now().year
    curr_month_name = calendar.month_name[datetime.now().month].upper()[:3]
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    aggregate_func = getattr(utility_api_wrapper, aggregate_func_name)
    cost_ytd_curr_year = aggregate_func(curr_year, [building_address])
    if cost_ytd_curr_year is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_month_name = 'DEC'
        cost_ytd_curr_year = aggregate_func(curr_year, [building_address])

    cost_ytd_curr_year_display = 'NA'
    if cost_ytd_curr_year:
        cost_ytd_curr_year_display = f'{int(cost_ytd_curr_year):,}'

    cost_ytd_last_year = aggregate_func(curr_year-1, [building_address])
    cost_ytd_last_year_display = 'NA'
    if cost_ytd_last_year:
        cost_ytd_last_year_display = f'{int(cost_ytd_last_year):,}'

    pct_diff_display = '-'
    if cost_ytd_curr_year and cost_ytd_last_year:
        pct_diff = get_pct_diff(cost_ytd_last_year, cost_ytd_curr_year)
        pct_diff_display = str(pct_diff) + '%'

    chart_func = getattr(utility_api_wrapper, chart_func_name)
    month_to_values_curr_year = chart_func(curr_year, [building_address])
    month_to_values_last_year = chart_func(curr_year-1, [building_address])
    month_name_and_values = _merge_month_values(month_to_values_curr_year,
                                                month_to_values_last_year,
                                                curr_year,
                                                is_temperature_normalized,
                                                building.zipcode)
    curr_year_label, last_year_label = _ytd_labels(curr_year, curr_month_name)

    resp = {}
    resp['electricity'] = {
        'last_year': {
            'label': last_year_label,
            'value': cost_ytd_last_year_display,
            'unit': unit
        },
        'current_year': {
            'label': curr_year_label,
            'value': cost_ytd_curr_year_display,
            'unit': unit,
            'year': curr_year
        },
        'pct_change': pct_diff_display,
        'month_and_values': month_name_and_values
    }

    return resp


def _ytd_labels(curr_year: int, curr_month_name: str):
    curr_year_label = None
    last_year_label = None
    if curr_month_name == 'JAN':
        curr_year_label = '{} {}'.format(curr_month_name, curr_year)
        last_year_label = '{} {}'.format(curr_month_name, curr_year-1)
    else:
        curr_year_label = 'JAN-{} {}'.format(curr_month_name, curr_year)
        last_year_label = 'JAN-{} {}'.format(curr_month_name, curr_year-1)

    return curr_year_label, last_year_label

def _merge_month_values(month_values_curr_year,
                        month_values_last_year,
                        curr_year,
                        is_temperature_normalized,
                        zipcode):
    # Accepts two dictionaries of the kind,
    #   {1: 100, 2: 400, 3: 250, 4: 150}
    #   {4: 100, 5: 250}
    # Returns a list, with only months from the first dictionary above:
    #   [
    #       {'month_name': 'JAN', 'curr_year': 100, 'last_year': None},
    #       {'month_name': 'FEB', 'curr_year': 400, 'last_year': None},
    #       {'month_name': 'MAR', 'curr_year': 250, 'last_year': None},
    #       {'month_name': 'APR', 'curr_year': 150, 'last_year': 100},
    #   ]
    merged_month_to_values = []
    for month_no, val in month_values_curr_year.items():
        values = {'curr_year': int(round(val)), 'last_year': None}
        if month_no in month_values_last_year:
            values['last_year'] = int(round(month_values_last_year[month_no]))
        merged_month_to_values.append((month_no, values))

    month_and_values = sorted(merged_month_to_values, key=lambda item:item[0])
    if is_temperature_normalized:
        temperature_normalization = TemperatureNormalization()
        month_and_values = temperature_normalization.normalize_values(curr_year, month_and_values, zipcode)

    # Pad future months
    if month_and_values[-1][0] < 12:
        for month_no in range(month_and_values[-1][0]+1, 13):
            month_and_values.append((month_no, {'curr_year': None, 'last_year': None}))


    month_name_and_values = []
    for m_a_v in month_and_values:
        month_and_vals = {
            'month_name': calendar.month_name[m_a_v[0]][:3].upper()
        }
        month_and_vals.update(m_a_v[1])

        month_name_and_values.append(month_and_vals)

    return month_name_and_values