import { api } from 'api';
import {
  AnalyticsSuperDocument,
  BuildingDocument,
  BuildingModel,
  EnergyAllocationModel,
  EventScheduleDocument,
  EnergyDemandDocument,
  GreenhouseGasEmissionDocument,
  EnergyStarRatingDocument,
  BuildingEngineerAnalyticsChartDocument,
  EnergyConsumptionYearComparisonDocument,
  SuperAnalyticsChartDocument,
  BuildingEngineerAnalyticsDocument,
} from 'models';
import { BuildingActionEnum } from './types';
import { SHOW_TOAST_NOTIFICATION } from 'store/toastNotification';
import { formatDatetime } from 'utils';

export function getBuildings() {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDINGS });
    return api
      .get<BuildingDocument[]>('/buildings')
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDINGS_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDINGS_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyDemand(
  buildingId: number,
  fromTime: string,
  toTime: string,
  energyType: string,
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND });
    return api
      .get<EnergyDemandDocument>(`/building/${buildingId}/energy-demand`, {
        fromTime,
        toTime,
        energyType
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function changeActiveBuilding(building: BuildingModel) {
  return {
    type: BuildingActionEnum.CHANGE_ACTIVE_BUILDING,
    payload: building,
  };
}

export function getEventSchedule(buildingId: number, fromTime?: string) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE });
    return api
      .get<EventScheduleDocument[]>(`/building/${buildingId}/event-scheduler`, {
        fromTime,
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyAllocation(buildingId: number, fromTime?: string) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION });
    return api
      .get<EnergyAllocationModel>(`/building/${buildingId}/energy-allocation`, {
        fromTime,
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnnualEnergyDemand(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND });
    return api
      .get<BuildingEngineerAnalyticsDocument[]>(
        `/building/${buildingId}/annual-energy-demand`,
        {
          year,
        },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnnualEnergyConsumption(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION,
    });
    return api
      .get<BuildingEngineerAnalyticsDocument[]>(
        `/building/${buildingId}/annual-energy-consumption`,
        { year },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnnualExport(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT });
    return api
      .get<BuildingEngineerAnalyticsDocument[]>(`/building/${buildingId}/annual-export`, { year })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getExportYearComparison(
  buildingId: number,
  year1: number,
  year2: number,
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON });
    return api
      .get<BuildingEngineerAnalyticsChartDocument[]>(
        `/building/${buildingId}/export/compare`, { year1, year2 }
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_SUCCESS,
          payload: {
            year1,
            year2,
            exportYearComparisonDocument: res,
            unit: res?.unit,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnnualSolarGeneration(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION,
    });
    return api
      .get<BuildingEngineerAnalyticsDocument[]>(
        `/building/${buildingId}/annual-solar-generation`,
        {
          year,
        },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getBuildingAnalyticsBoxes(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES });
    return api
      .get(`/building/${buildingId}/analytics_boxes`)
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      })
  }
}

export function getBuildingAssetNames(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES });
    return api
      .get(`/assets/${buildingId}/asset_names`)
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getBuildingAssetDropdownOptions(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS });
    return api
      .get(`/assets/${buildingId}/dropdown_values`)
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getBuildingAssetChartValues(buildingId: number, pointId: number, date: Date) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES });
    const fromTime = formatDatetime(date);
    return api
      .get(`/assets/asset-chart-values`, {buildingId, pointId, fromTime})
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getGreenhouseGasEmissions(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS });
    return api
      .get<GreenhouseGasEmissionDocument[]>(
        `/building/${buildingId}/greenhouse-gas-emissions`,
        { year },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyStarRatings(
  buildingId: number,
  year: number = new Date().getFullYear(),
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS });
    return api
      .get<EnergyStarRatingDocument[]>(
        `/building/${buildingId}/energy-star-rating`,
        { year },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnalyticsCostAndSaving(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING });
    return api
      .get<AnalyticsSuperDocument>(`/analytics/${buildingId}/cost-and-savings`)
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_SUCCESS,
          payload: res,
        });
      })
      .catch(err => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnalyticsEnergyDemand(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND });
    return api
      .get<AnalyticsSuperDocument>(`/analytics/${buildingId}/energy-demand`)
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnalyticsEnergyConsumption(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION });
    return api
      .get<AnalyticsSuperDocument>(
        `/analytics/${buildingId}/energy-consumption`,
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnalyticsEnergyUsagePerCapita(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA,
    });
    return api
      .get<AnalyticsSuperDocument>(
        `/analytics/${buildingId}/energy-usage-per-capita`,
      )
      .then(res => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getAnalyticsEnergyCostPerCapita(buildingId: number) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA,
    });
    return api
      .get<AnalyticsSuperDocument>(
        `/analytics/${buildingId}/energy-cost-per-capita`,
      )
      .then(res => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyDemandYearComparison(
  buildingId: number,
  year1: number,
  year2: number,
) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON });
    return api
      .get<BuildingEngineerAnalyticsChartDocument>(
        `/building/${buildingId}/energy-demand/compare`,
        {
          year1: year1,
          year2: year2,
        },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_SUCCESS,
          payload: {
            year1,
            year2,
            energyDemandYearComparisonDocument: res,
            unit: res?.unit,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyConsumptionYearComparison(
  buildingId: number,
  year1: number,
  year2: number,
) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON,
    });
    return api
      .get<EnergyConsumptionYearComparisonDocument>(
        `/building/${buildingId}/energy-consumption/compare`,
        {
          year1: year1,
          year2: year2,
        },
      )
      .then(res => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_SUCCESS,
          payload: {
            year1,
            year2,
            energyConsumptionYearComparisonDocument: res,
            unit: res?.unit,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getSolarGenerationYearComparison(
  buildingId: number,
  year1: number,
  year2: number,
) {
  return function(dispatch: Function) {
    dispatch({
      type: BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON,
    });
    return api
      .get<BuildingEngineerAnalyticsChartDocument>(
        `/building/${buildingId}/solar-generation/compare`,
        {
          year1: year1,
          year2: year2,
        },
      )
      .then(res => {
        dispatch({
          type:
            BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_SUCCESS,
          payload: {
            year1,
            year2,
            solarGenerationYearComparisonDocument: res,
            unit: res?.unit,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getCostsAndSavingsChart({
  buildingId,
  isTemperatureNormalized,
}: {
  buildingId: number;
  isTemperatureNormalized: number;
}) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART });
    return api
      .get<SuperAnalyticsChartDocument>('/analytics/cost-and-savings-chart', {
        buildingId,
        isTemperatureNormalized,
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_SUCCESS,
          payload: {
            chartCostsAndSavingsDocument: res,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyDemandChart({
  buildingId,
  isTemperatureNormalized,
}: {
  buildingId: number;
  isTemperatureNormalized: number;
}) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART });
    return api
      .get<SuperAnalyticsChartDocument>('/analytics/energy-demand-chart', {
        buildingId,
        isTemperatureNormalized,
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_SUCCESS,
          payload: {
            chartEnergyDemandDocument: res,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyConsumptionChart({
  buildingId,
  isTemperatureNormalized,
}: {
  buildingId: number;
  isTemperatureNormalized: number;
}) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART });
    return api
      .get<SuperAnalyticsChartDocument>('/analytics/energy-consumption-chart', {
        buildingId,
        isTemperatureNormalized,
      })
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_SUCCESS,
          payload: {
            chartEnergyConsumptionDocument: res,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyUsagePerCapitaChart({
  buildingId,
  isTemperatureNormalized,
}: {
  buildingId: number;
  isTemperatureNormalized: number;
}) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART });
    return api
      .get<SuperAnalyticsChartDocument>(
        '/analytics/energy-usage-per-capita-chart',
        {
          buildingId,
          isTemperatureNormalized,
        },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_SUCCESS,
          payload: {
            chartEnergyUsagePerCapitaDocument: res,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getEnergyCostPerCapitaChart({
  buildingId,
  isTemperatureNormalized,
}: {
  buildingId: number;
  isTemperatureNormalized: number;
}) {
  return function(dispatch: Function) {
    dispatch({ type: BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART });
    return api
      .get<SuperAnalyticsChartDocument>(
        '/analytics/energy-cost-per-capita-chart',
        {
          buildingId,
          isTemperatureNormalized,
        },
      )
      .then(res => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_SUCCESS,
          payload: {
            chartEnergyCostPerCapitaDocument: res,
          },
        });
      })
      .catch((err: any) => {
        dispatch({
          type: BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_ERROR,
          payload: { error: err },
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}
