import { BuildingActionEnum, BuildingsActionTypes } from '.';
import {
  AnalyticsSuperModel,
  BuildingEngineerAnalyticsChartModel,
  BuildingEngineerAnalyticsModel,
  BuildingModel,
  DeviceModel,
  EnergyAllocationModel,
  EnergyConsumptionYearComparisonModel,
  EnergyDemandModel,
  EnergyStarRatingModel,
  EventScheduleModel,
  GreenhouseGasEmissionModel,
  SuperAnalyticsChartModel,
  UtilityModel,
} from 'models';
import { formatAssetDropdownOptions, getActiveBuildingFromUrlParams } from './helpers';

export interface BuildingsState {
  activeBuilding?: BuildingModel | null;
  analyticsBoxes?: string[] | null;
  analyticsCostAndSaving?: AnalyticsSuperModel | null;
  analyticsCostAndSavingLoading: boolean;
  analyticsEnergyConsumption?: AnalyticsSuperModel | null;
  analyticsEnergyConsumptionLoading: boolean;
  analyticsEnergyCostPerCapita?: AnalyticsSuperModel | null;
  analyticsEnergyCostPerCapitaLoading: boolean;
  analyticsEnergyDemand?: AnalyticsSuperModel | null;
  analyticsEnergyDemandLoading: boolean;
  analyticsEnergyUsagePerCapita?: AnalyticsSuperModel | null;
  analyticsEnergyUsagePerCapitaLoading: boolean;
  annualEnergyConsumption?: BuildingEngineerAnalyticsModel[] | null;
  annualEnergyDemand?: BuildingEngineerAnalyticsModel[] | null;
  annualExport?: any;
  annualSolarGeneration?: BuildingEngineerAnalyticsModel[] | null;
  assetChartLoading: boolean;
  assetChartUnitMeasureOf?: string;
  assetChartUnitSymbol?: string;
  assetChartValues?: any | null;
  assetNames?: string[] | null;
  buildings?: BuildingModel[] | null;
  chartCostsAndSavings?: SuperAnalyticsChartModel | null;
  chartEnergyConsumption?: SuperAnalyticsChartModel | null;
  chartEnergyCostPerCapita?: SuperAnalyticsChartModel | null;
  chartEnergyDemand?: SuperAnalyticsChartModel | null;
  chartEnergyUsagePerCapita?: SuperAnalyticsChartModel | null;
  devices?: DeviceModel[] | null;
  dropdownOptions?: any | null;
  energyAllocation?: EnergyAllocationModel | null;
  energyConsumptionYearComparison?: EnergyConsumptionYearComparisonModel | null;
  energyConsumptionYearComparisonLoading?: boolean;
  energyDemand?: EnergyDemandModel | null;
  energyDemandLoading?: boolean;
  energyDemandYearComparison?: BuildingEngineerAnalyticsChartModel | null;
  energyDemandYearComparisonLoading?: boolean;
  energyStarRatings?: EnergyStarRatingModel[] | null;
  error?: any;
  eventSchedule?: EventScheduleModel[] | null;
  exportYearComparison?: BuildingEngineerAnalyticsChartModel | null;
  exportYearComparisonLoading?: boolean;
  greenhouseGasEmissions?: GreenhouseGasEmissionModel[] | null;
  loading?: boolean;
  solarGenerationYearComparison?: BuildingEngineerAnalyticsChartModel | null;
  solarGenerationYearComparisonLoading?: boolean;
  utilities?: UtilityModel[] | null;
}

export const initialState: BuildingsState = {
  activeBuilding: null,
  analyticsCostAndSaving: null,
  analyticsCostAndSavingLoading: false,
  analyticsEnergyConsumption: null,
  analyticsEnergyConsumptionLoading: false,
  analyticsEnergyCostPerCapita: null,
  analyticsEnergyCostPerCapitaLoading: false,
  analyticsEnergyDemand: null,
  analyticsEnergyDemandLoading: false,
  analyticsEnergyUsagePerCapita: null,
  analyticsEnergyUsagePerCapitaLoading: false,
  annualEnergyConsumption: null,
  annualEnergyDemand: null,
  annualSolarGeneration: null,
  assetChartLoading: false,
  assetNames: null,
  buildings: null,
  chartCostsAndSavings: null,
  chartEnergyConsumption: null,
  chartEnergyCostPerCapita: null,
  chartEnergyDemand: null,
  chartEnergyUsagePerCapita: null,
  devices: null,
  energyAllocation: null,
  energyConsumptionYearComparison: null,
  energyConsumptionYearComparisonLoading: false,
  energyDemand: null,
  energyDemandLoading: false,
  energyDemandYearComparison: null,
  energyDemandYearComparisonLoading: false,
  energyStarRatings: null,
  error: null,
  eventSchedule: null,
  exportYearComparisonLoading: false,
  greenhouseGasEmissions: null,
  loading: false,
  solarGenerationYearComparisonLoading: false,
  utilities: null,
};

export function buildingsReducer(
  state = initialState,
  action: BuildingsActionTypes,
): BuildingsState {
  switch (action.type) {
    case BuildingActionEnum.CHANGE_ACTIVE_BUILDING:
      return {
        ...state,
        activeBuilding: action.payload,
      };
    case BuildingActionEnum.FETCH_BUILDINGS_SUCCESS:
      const buildings = action.payload.map(buildingDocument => new BuildingModel(buildingDocument));
      const activeBuilding = getActiveBuildingFromUrlParams(buildings);
      return {
        ...state,
        activeBuilding,
        buildings,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDINGS_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDINGS:
      return {
        ...state,
        loading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES:
      return {
        ...state,
        loading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_SUCCESS:
      return {
        ...state,
        analyticsBoxes: action.payload,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND:
      return {
        ...state,
        energyDemandLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_SUCCESS:
      return {
        ...state,
        energyDemand: new EnergyDemandModel(action.payload),
        energyDemandLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        energyDemandLoading: false,
        loading: false,
      };

    case BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE:
      return {
        ...state,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_SUCCESS:
      return {
        ...state,
        eventSchedule: action.payload.map(
          eventScheduleDocument =>
            new EventScheduleModel(eventScheduleDocument),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION:
      return {
        ...state,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_SUCCESS:
      return {
        ...state,
        energyAllocation: new EnergyAllocationModel(action.payload),
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND:
      return {
        ...state,
        annualEnergyDemand: null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_SUCCESS:
      return {
        ...state,
        annualEnergyDemand: action.payload.map(
          buildingEngineerAnalyticsDocument =>
            new BuildingEngineerAnalyticsModel(
              buildingEngineerAnalyticsDocument,
            ),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION:
      return {
        ...state,
        annualEnergyConsumption: null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_SUCCESS:
      return {
        ...state,
        annualEnergyConsumption: action.payload.map(
          buildingEngineerAnalyticsDocument =>
            new BuildingEngineerAnalyticsModel(
              buildingEngineerAnalyticsDocument,
            ),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT:
      return {
        ...state,
        annualExport: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_SUCCESS:
      return {
        ...state,
        annualExport: action.payload.map(buildingEngineerAnalyticsDocument => (
          new BuildingEngineerAnalyticsModel(buildingEngineerAnalyticsDocument)
        )),
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION:
      return {
        ...state,
        annualSolarGeneration: null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_SUCCESS:
      return {
        ...state,
        annualSolarGeneration: action.payload.map(
          buildingEngineerAnalyticsDocument =>
            new BuildingEngineerAnalyticsModel(
              buildingEngineerAnalyticsDocument,
            ),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES:
      return {
        ...state,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_SUCCESS:
      return {
        ...state,
        assetNames: action.payload,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS:
      return {
        ...state,
        loading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        dropdownOptions: formatAssetDropdownOptions(action.payload),
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES:
      return {
        ...state,
        assetChartLoading: true,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_SUCCESS:
      return {
        ...state,
        assetChartValues: action.payload.chartValues,
        assetChartUnitMeasureOf: action.payload.unitMeasureOf,
        assetChartUnitSymbol: action.payload.unitSymbol,
        assetChartLoading: false,
      };
    case BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        assetChartLoading: false,
      };
    case BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS:
      return {
        ...state,
        greenhouseGasEmissions: null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_SUCCESS:
      return {
        ...state,
        greenhouseGasEmissions: action.payload.map(
          greenhouseGasEmissionDocument =>
            new GreenhouseGasEmissionModel(greenhouseGasEmissionDocument),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
      };
    case BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS:
      return {
        ...state,
        energyStarRatings: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_SUCCESS:
      return {
        ...state,
        energyStarRatings: action.payload.map(
          energyStarRatingDocument =>
            new EnergyStarRatingModel(energyStarRatingDocument),
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING:
      return {
        ...state,
        analyticsCostAndSaving: null,
        analyticsCostAndSavingLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_SUCCESS:
      return {
        ...state,
        analyticsCostAndSaving: new AnalyticsSuperModel(action.payload),
        analyticsCostAndSavingLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        analyticsCostAndSavingLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND:
      return {
        ...state,
        analyticsEnergyDemand: null,
        analyticsEnergyDemandLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_SUCCESS:
      return {
        ...state,
        analyticsEnergyDemand: new AnalyticsSuperModel(action.payload),
        analyticsEnergyDemandLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        analyticsEnergyDemandLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION:
      return {
        ...state,
        analyticsEnergyConsumption: null,
        analyticsEnergyConsumptionLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_SUCCESS:
      return {
        ...state,
        analyticsEnergyConsumption: new AnalyticsSuperModel(action.payload),
        analyticsEnergyConsumptionLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        analyticsEnergyConsumptionLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA:
      return {
        ...state,
        analyticsEnergyUsagePerCapita: null,
        analyticsEnergyUsagePerCapitaLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_SUCCESS:
      return {
        ...state,
        analyticsEnergyUsagePerCapita: new AnalyticsSuperModel(action.payload),
        analyticsEnergyUsagePerCapitaLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        analyticsEnergyUsagePerCapitaLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA:
      return {
        ...state,
        analyticsEnergyCostPerCapita: null,
        analyticsEnergyCostPerCapitaLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_SUCCESS:
      return {
        ...state,
        analyticsEnergyCostPerCapita: new AnalyticsSuperModel(action.payload),
        analyticsEnergyCostPerCapitaLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        analyticsEnergyCostPerCapitaLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON:
      return {
        ...state,
        energyDemandYearComparison: null,
        energyDemandYearComparisonLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_SUCCESS:
      return {
        ...state,
        energyDemandYearComparison: new BuildingEngineerAnalyticsChartModel(
          action.payload.year1,
          action.payload.year2,
          action.payload.energyDemandYearComparisonDocument,
          action.payload.unit,
        ),
        energyDemandYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        energyDemandYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON:
      return {
        ...state,
        energyConsumptionYearComparison: null,
        energyConsumptionYearComparisonLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_SUCCESS:
      return {
        ...state,
        energyConsumptionYearComparison: new EnergyConsumptionYearComparisonModel(
          action.payload.year1,
          action.payload.year2,
          action.payload.energyConsumptionYearComparisonDocument,
          action.payload.unit,
        ),
        energyConsumptionYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        energyConsumptionYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON:
      return {
        ...state,
        exportYearComparison: null,
        exportYearComparisonLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_SUCCESS:
      return {
        ...state,
        exportYearComparison: new BuildingEngineerAnalyticsChartModel(
          action.payload.year1,
          action.payload.year2,
          action.payload.exportYearComparisonDocument,
          action.payload.unit,
        ),
        exportYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        exportYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON:
      return {
        ...state,
        solarGenerationYearComparison: null,
        solarGenerationYearComparisonLoading: true,
        loading: true,
      };
    case BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_SUCCESS:
      return {
        ...state,
        solarGenerationYearComparison: new BuildingEngineerAnalyticsChartModel(
          action.payload.year1,
          action.payload.year2,
          action.payload.solarGenerationYearComparisonDocument,
          action.payload.unit,
        ),
        solarGenerationYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        solarGenerationYearComparisonLoading: false,
        loading: false,
      };
    case BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART:
      return {
        ...state,
        chartCostsAndSavings: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_SUCCESS:
      return {
        ...state,
        chartCostsAndSavings: new SuperAnalyticsChartModel(
          action.payload.chartCostsAndSavingsDocument,
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART:
      return {
        ...state,
        chartEnergyDemand: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_SUCCESS:
      return {
        ...state,
        chartEnergyDemand: new SuperAnalyticsChartModel(
          action.payload.chartEnergyDemandDocument,
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART:
      return {
        ...state,
        chartEnergyConsumption: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_SUCCESS:
      return {
        ...state,
        chartEnergyConsumption: new SuperAnalyticsChartModel(
          action.payload.chartEnergyConsumptionDocument,
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART:
      return {
        ...state,
        chartEnergyUsagePerCapita: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_SUCCESS:
      return {
        ...state,
        chartEnergyUsagePerCapita: new SuperAnalyticsChartModel(
          action.payload.chartEnergyUsagePerCapitaDocument,
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };

    case BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART:
      return {
        ...state,
        chartEnergyCostPerCapita: null,
        loading: true,
      };
    case BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_SUCCESS:
      return {
        ...state,
        chartEnergyCostPerCapita: new SuperAnalyticsChartModel(
          action.payload.chartEnergyCostPerCapitaDocument,
        ),
        loading: false,
      };
    case BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };

    default:
      return state;
  }
}
