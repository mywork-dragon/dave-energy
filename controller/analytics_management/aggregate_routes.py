# type: ignore

from datetime import datetime

from app import app
from flask import jsonify
from typing import Any, Dict, Tuple

from config import logger
from controller.analytics_management.gas_and_steam import GasAndSteam
from controller.analytics_management.lcl_common import get_pct_diff
from controller.analytics_management.electricity_cost import ElectricityCost
from third_party.utility_api.utility_api_wrapper import UtilityApiWrapper
from models.building import Building


@app.route("/analytics/<int:building_id>/get-energy-types", methods=["GET"])
def get_energy_types(building_id: int) -> Tuple[Dict[str, Any], int]:
    logger.info('Inside get_energy_types')
    building = Building.query.filter_by(id=building_id).first()
    
    energy_types = ["electricity"]
    if building.consumes_gas:
        energy_types.append("gas")
    if building.consumes_steam:
        energy_types.append("steam")

    return jsonify(energy_types), 200

@app.route("/analytics/<int:building_id>/cost-and-savings", methods=["GET"])
def cost_and_savings(building_id: int) -> Tuple[Dict[str, Any], int]:
    """
    Returns cost savings ytd for utilities consumed by the building
    """
    logger.info('Inside cost_and_savings')
    curr_year = datetime.now().year
    building = Building.query.filter_by(id=building_id).first()
    building_address = building.service_address if building.service_address else building.address
    utility_api_wrapper = UtilityApiWrapper()
    elec_cost = ElectricityCost()

    resp = {
        'electricity': _blank_response('$')
    }

    # Electricity
    # YTD
    cost_ytd_curr_year = elec_cost.get_cost_ytd(building_id, building_address, curr_year)
    if cost_ytd_curr_year is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        cost_ytd_curr_year = elec_cost.get_cost_ytd(building_id, building_address, curr_year)

    cost_ytd_last_year = elec_cost.get_cost_ytd(building_id, building_address, curr_year-1)
    if cost_ytd_curr_year:
        resp['electricity']['ytd']['value'] = f'{int(round(cost_ytd_curr_year)):,}'
        if cost_ytd_last_year:
            pct_diff = get_pct_diff(cost_ytd_last_year, cost_ytd_curr_year)
            resp['electricity']['ytd']['pct_change'] = str(pct_diff) + '%'
    
    # Last Billing
    dt_curr_cycle = utility_api_wrapper.get_date_in_latest_billing_cycle(building_address)
    last_billing_curr_year = elec_cost.get_cost_latest_billing_cycle(building_id, building_address, dt_curr_cycle)

    dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
    last_billing_last_year = elec_cost.get_cost_latest_billing_cycle(building_id, building_address, dt_curr_cycle_last_year)

    if last_billing_curr_year:
        resp['electricity']['last_billing']['value'] = f'{int(round(last_billing_curr_year)):,}'
        if last_billing_last_year:
            pct_diff = get_pct_diff(last_billing_last_year, last_billing_curr_year)
            resp['electricity']['last_billing']['pct_change'] = str(pct_diff) + '%'

    # Check on Gas
    if building.consumes_gas:
        resp['gas'] = _blank_response('$')
        gas_and_steam = GasAndSteam()
        # YTD
        cost_ytd_curr_year = gas_and_steam.get_gas_cost_ytd(building_id, curr_year)
        cost_ytd_last_year = gas_and_steam.get_gas_cost_ytd(building_id, curr_year-1)
        if cost_ytd_curr_year:
            resp['gas']['ytd']['value'] = f'{int(round(cost_ytd_curr_year)):,}'
            if cost_ytd_last_year:
                pct_diff = get_pct_diff(cost_ytd_last_year, cost_ytd_curr_year)
                resp['gas']['ytd']['pct_change'] = str(pct_diff) + '%'

        # Last Billing
        dt_curr_cycle = gas_and_steam.get_date_in_latest_gas_billing_cycle(building_id)
        last_billing_curr_year = gas_and_steam.get_gas_cost_curr_cycle(building_id, dt_curr_cycle)
        dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
        last_billing_last_year = gas_and_steam.get_gas_cost_curr_cycle(building_id, dt_curr_cycle_last_year)
        if last_billing_curr_year:
            resp['gas']['last_billing']['value'] = f'{int(round(last_billing_curr_year)):,}'
            if last_billing_last_year:
                pct_diff = get_pct_diff(last_billing_last_year, last_billing_curr_year)
                resp['gas']['last_billing']['pct_change'] = str(pct_diff) + '%'

    # Check on Steam
    if building.consumes_steam:
        resp['steam'] = _blank_response('$')
        # YTD
        cost_ytd_curr_year = gas_and_steam.get_steam_cost_ytd(building_id, curr_year)
        cost_ytd_last_year = gas_and_steam.get_steam_cost_ytd(building_id, curr_year-1)
        if cost_ytd_curr_year:
            resp['steam']['ytd']['value'] = f'{int(round(cost_ytd_curr_year)):,}'
            if cost_ytd_last_year:
                pct_diff = get_pct_diff(cost_ytd_last_year, cost_ytd_curr_year)
                resp['steam']['ytd']['pct_change'] = str(pct_diff) + '%'

        # Last Billing
        dt_curr_cycle = gas_and_steam.get_date_in_latest_steam_billing_cycle(building_id)
        last_billing_curr_year = gas_and_steam.get_steam_cost_curr_cycle(building_id, dt_curr_cycle)
        dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
        last_billing_last_year = gas_and_steam.get_steam_cost_curr_cycle(building_id, dt_curr_cycle_last_year)
        if last_billing_curr_year:
            resp['steam']['last_billing']['value'] = f'{int(round(last_billing_curr_year)):,}'
            if last_billing_last_year:
                pct_diff = get_pct_diff(last_billing_last_year, last_billing_curr_year)
                resp['steam']['last_billing']['pct_change'] = str(pct_diff) + '%'

    return resp, 200


@app.route("/analytics/<int:building_id>/energy-consumption", methods=["GET"])
def energy_consumption(building_id: int) -> Tuple[Dict[str, Any], int]:
    """
    Returns energy consumption of the building for the current billing cycle
    """
    logger.info('Inside energy_consumption')
    curr_year = datetime.now().year
    building = Building.query.filter_by(id=building_id).first()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    resp = {
        'electricity': _blank_response('kWh')
    }

    # Electricity
    # YTD
    curr_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])
    if curr_year_val is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])

    last_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year-1, [building_address])
    if curr_year_val:
        resp['electricity']['ytd']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['ytd']['pct_change'] = str(pct_diff) + '%'

    # Last Billing
    dt_curr_cycle = utility_api_wrapper.get_date_in_latest_billing_cycle(building_address)
    curr_year_val = utility_api_wrapper.get_energy_consumption_curr_cycle(dt_curr_cycle, [building_address])
    dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
    last_year_val = utility_api_wrapper.get_energy_consumption_curr_cycle(dt_curr_cycle_last_year, [building_address])
    if curr_year_val:
        resp['electricity']['last_billing']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['last_billing']['pct_change'] = str(pct_diff) + '%'

    # Check on Gas
    if building.consumes_gas:
        resp['gas'] = _blank_response('kWh')

    # Check on Steam
    if building.consumes_steam:
        resp['steam'] = _blank_response('kWh')


    return resp, 200


@app.route("/analytics/<int:building_id>/energy-demand", methods=["GET"])
def energy_demand(building_id: int) -> Tuple[Dict[str, Any], int]:
    """
    Returns energy demand of the building for the current billing cycle
    """
    logger.info('Inside energy_demand')
    curr_year = datetime.now().year
    building = Building.query.filter_by(id=building_id).first()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    resp = {
        'electricity': _blank_response('kW')
    }

    # YTD
    curr_year_val = utility_api_wrapper.get_energy_demand_ytd(curr_year, [building_address])
    if curr_year_val is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_year_val = utility_api_wrapper.get_energy_demand_ytd(curr_year, [building_address])

    last_year_val = utility_api_wrapper.get_energy_demand_ytd(curr_year-1, [building_address])
    if curr_year_val:
        resp['electricity']['ytd']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['ytd']['pct_change'] = str(pct_diff) + '%'

    # Last Billing
    dt_curr_cycle = utility_api_wrapper.get_date_in_latest_billing_cycle(building_address)
    curr_year_val = utility_api_wrapper.get_energy_demand_curr_cycle(dt_curr_cycle, [building_address])
    dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
    last_year_val = utility_api_wrapper.get_energy_demand_curr_cycle(dt_curr_cycle_last_year, [building_address])
    if curr_year_val:
        pct_diff = get_pct_diff(last_year_val, curr_year_val)
        resp['electricity']['last_billing']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['last_billing']['pct_change'] = str(pct_diff) + '%'

    return resp, 200


@app.route("/analytics/<int:building_id>/energy-usage-per-capita", methods=["GET"])
def energy_usage_per_capita(building_id: int) -> Tuple[Dict[str, Any], int]:
    """
    Returns energy consumption by utility of the building per capita for the current billing cycle
    """
    logger.info('Inside energy_usage_per_capita')
    curr_year = datetime.now().year
    building = Building.query.filter_by(id=building_id).first()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    resp = {
        'electricity': _blank_response('kWh/capita')
    }

    # YTD
    curr_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])
    if curr_year_val is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year, [building_address])

    last_year_val = utility_api_wrapper.get_energy_consumption_ytd(curr_year-1, [building_address])
    if curr_year_val:
        curr_year_val = curr_year_val / building.occupancy
        resp['electricity']['ytd']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            last_year_val = last_year_val / building.occupancy
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['ytd']['pct_change'] = str(pct_diff) + '%'

    # Last Billing
    dt_curr_cycle = utility_api_wrapper.get_date_in_latest_billing_cycle(building_address)
    curr_year_val = utility_api_wrapper.get_energy_consumption_curr_cycle(dt_curr_cycle, [building_address])
    dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
    last_year_val = utility_api_wrapper.get_energy_consumption_curr_cycle(dt_curr_cycle_last_year, [building_address])
    if curr_year_val:
        usage_per_capita_curr_year = curr_year_val / building.occupancy
        resp['electricity']['last_billing']['value'] = f'{int(round(usage_per_capita_curr_year)):,}'
        if last_year_val:
            usage_per_capita_last_year = last_year_val / building.occupancy
            pct_diff = get_pct_diff(usage_per_capita_last_year, usage_per_capita_curr_year)
            resp['electricity']['last_billing']['pct_change'] = str(pct_diff) + '%'

    # Check on Gas
    if building.consumes_gas:
        resp['gas'] = _blank_response('kWh/capita')

    # Check on Steam
    if building.consumes_steam:
        resp['steam'] = _blank_response('kWh/capita')

    return resp, 200


@app.route("/analytics/<int:building_id>/energy-cost-per-capita", methods=["GET"])
def energy_cost_per_capita(building_id: int) -> Tuple[Dict[str, Any], int]:
    """
    Returns energy cost by utility of the building per capita for the current billing cycle
    """
    logger.info('Inside energy_cost_per_capita')
    curr_year = datetime.now().year
    building = Building.query.filter_by(id=building_id).first()
    elec_cost = ElectricityCost()
    utility_api_wrapper = UtilityApiWrapper()
    building_address = building.service_address if building.service_address else building.address

    resp = {
        'electricity': _blank_response('$/capita')
    }

    # YTD
    curr_year_val = elec_cost.get_cost_ytd(building_id, building_address, curr_year)
    if curr_year_val is None:
        # This case will only be used in the beginning of a year when Utility API does not have
        # any bills for the new year
        curr_year = curr_year - 1
        curr_year_val = elec_cost.get_cost_ytd(building_id, building_address, curr_year)

    last_year_val = elec_cost.get_cost_ytd(building_id, building_address, curr_year-1)
    if curr_year_val:
        curr_year_val = curr_year_val / building.occupancy
        resp['electricity']['ytd']['value'] = f'{int(round(curr_year_val)):,}'
        if last_year_val:
            last_year_val = last_year_val / building.occupancy
            pct_diff = get_pct_diff(last_year_val, curr_year_val)
            resp['electricity']['ytd']['pct_change'] = str(pct_diff) + '%'

    # Last Billing
    dt_curr_cycle = utility_api_wrapper.get_date_in_latest_billing_cycle(building_address)
    last_billing_curr_year = elec_cost.get_cost_latest_billing_cycle(building_id, building_address, dt_curr_cycle)

    dt_curr_cycle_last_year = dt_curr_cycle.replace(year=curr_year-1)
    last_billing_last_year = elec_cost.get_cost_latest_billing_cycle(building_id, building_address, dt_curr_cycle_last_year)
    if last_billing_curr_year:
        last_billing_curr_year = last_billing_curr_year / building.occupancy
        resp['electricity']['last_billing']['value'] = f'{int(round(last_billing_curr_year)):,}'
        if last_billing_last_year:
            last_billing_last_year = last_billing_last_year / building.occupancy
            pct_diff = get_pct_diff(last_billing_last_year, last_billing_curr_year)
            resp['electricity']['last_billing']['pct_change'] = str(pct_diff) + '%'

    # Check on Gas
    if building.consumes_gas:
        resp['gas'] = _blank_response('$/capita')

    # Check on Steam
    if building.consumes_steam:
        resp['steam'] = _blank_response('$/capita')

    return resp,200

def _blank_response(unit):
    return {
        'ytd': {
                    'value': 'NA',
                    'pct_change': 'NA',
                    'unit': unit
                },
        'last_billing': {
                    'value': 'NA',
                    'pct_change': 'NA',
                    'unit': unit
                }
    }