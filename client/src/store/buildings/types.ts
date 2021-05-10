import {
  AnalyticsSuperDocument,
  BuildingDocument,
  BuildingModel,
  EventScheduleDocument,
  EnergyAllocationDocument,
  EnergyDemandDocument,
  GreenhouseGasEmissionDocument,
  EnergyStarRatingDocument,
  BuildingEngineerAnalyticsChartDocument,
  EnergyConsumptionYearComparisonDocument,
  SuperAnalyticsChartDocument,
  BuildingEngineerAnalyticsDocument,
} from 'models';

export enum BuildingActionEnum {
  CHANGE_ACTIVE_BUILDING = 'CHANGE_ACTIVE_BUILDING',
  FETCH_ANALYTICS_COST_AND_SAVING = 'FETCH_ANALYTICS_COST_AND_SAVING',
  FETCH_ANALYTICS_COST_AND_SAVING_ERROR = 'FETCH_ANALYTICS_COST_AND_SAVING_ERROR',
  FETCH_ANALYTICS_COST_AND_SAVING_SUCCESS = 'FETCH_ANALYTICS_COST_AND_SAVING_SUCCESS',
  FETCH_ANALYTICS_ENERGY_CONSUMPTION = 'FETCH_ANALYTICS_ENERGY_CONSUMPTION',
  FETCH_ANALYTICS_ENERGY_CONSUMPTION_ERROR = 'FETCH_ANALYTICS_ENERGY_CONSUMPTION_ERROR',
  FETCH_ANALYTICS_ENERGY_CONSUMPTION_SUCCESS = 'FETCH_ANALYTICS_ENERGY_CONSUMPTION_SUCCESS',
  FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA = 'FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA',
  FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_ERROR = 'FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_ERROR',
  FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_SUCCESS = 'FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_SUCCESS',
  FETCH_ANALYTICS_ENERGY_DEMAND = 'FETCH_ANALYTICS_ENERGY_DEMAND',
  FETCH_ANALYTICS_ENERGY_DEMAND_ERROR = 'FETCH_ANALYTICS_ENERGY_DEMAND_ERROR',
  FETCH_ANALYTICS_ENERGY_DEMAND_SUCCESS = 'FETCH_ANALYTICS_ENERGY_DEMAND_SUCCESS',
  FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA = 'FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA',
  FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_ERROR = 'FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_ERROR',
  FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_SUCCESS = 'FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_SUCCESS',
  FETCH_ANNUAL_SOLAR_GENERATION = 'FETCH_ANNUAL_SOLAR_GENERATION',
  FETCH_ANNUAL_SOLAR_GENERATION_ERROR = 'FETCH_ANNUAL_SOLAR_GENERATION_ERROR',
  FETCH_ANNUAL_SOLAR_GENERATION_SUCCESS = 'FETCH_ANNUAL_SOLAR_GENERATION_SUCCESS',
  FETCH_BUILDING_ANALYTICS_BOXES = 'FETCH_BUILDING_ANALYTICS_BOXES',
  FETCH_BUILDING_ANALYTICS_BOXES_ERROR = 'FETCH_BUILDING_ANALYTICS_BOXES_ERROR',
  FETCH_BUILDING_ANALYTICS_BOXES_SUCCESS = 'FETCH_BUILDING_ANALYTICS_BOXES_SUCCESS',
  FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION = 'FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION',
  FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_ERROR = 'FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR',
  FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_SUCCESS = 'FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_SUCCESS',
  FETCH_BUILDING_ANNUAL_ENERGY_DEMAND = 'FETCH_BUILDING_ANNUAL_ENERGY_DEMAND',
  FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR = 'FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR',
  FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_SUCCESS = 'FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_SUCCESS',
  FETCH_BUILDING_ANNUAL_EXPORT = 'FETCH_BUILDING_ANNUAL_EXPORT',
  FETCH_BUILDING_ANNUAL_EXPORT_ERROR = 'FETCH_BUILDING_ANNUAL_EXPORT_ERROR',
  FETCH_BUILDING_ANNUAL_EXPORT_SUCCESS = 'FETCH_BUILDING_ANNUAL_EXPORT_SUCCESS',
  FETCH_BUILDING_ASSET_CHART_VALUES = 'FETCH_BUILDING_ASSET_CHART_VALUES',
  FETCH_BUILDING_ASSET_CHART_VALUES_ERROR = 'FETCH_BUILDING_ASSET_CHART_VALUES_ERROR',
  FETCH_BUILDING_ASSET_CHART_VALUES_SUCCESS = 'FETCH_BUILDING_ASSET_CHART_VALUES_SUCCESS',
  FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS = 'FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS',
  FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_ERROR = 'FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_ERROR',
  FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_SUCCESS = 'FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_SUCCESS',
  FETCH_BUILDING_ASSET_NAMES = 'FETCH_BUILDING_ASSET_NAMES',
  FETCH_BUILDING_ASSET_NAMES_ERROR = 'FETCH_BUILDING_ASSET_NAMES_ERROR',
  FETCH_BUILDING_ASSET_NAMES_SUCCESS = 'FETCH_BUILDING_ASSET_NAMES_SUCCESS',
  FETCH_BUILDING_ENERGY_ALLOCATION = 'FETCH_BUILDING_ENERGY_ALLOCATION',
  FETCH_BUILDING_ENERGY_ALLOCATION_ERROR = 'FETCH_BUILDING_ENERGY_ALLOCATION_ERROR',
  FETCH_BUILDING_ENERGY_ALLOCATION_SUCCESS = 'FETCH_BUILDING_ENERGY_ALLOCATION_SUCCESS',
  FETCH_BUILDING_ENERGY_DEMAND = 'FETCH_BUILDING_ENERGY_DEMAND',
  FETCH_BUILDING_ENERGY_DEMAND_ERROR = 'FETCH_BUILDING_ENERGY_DEMAND_ERROR',
  FETCH_BUILDING_ENERGY_DEMAND_SUCCESS = 'FETCH_BUILDING_ENERGY_DEMAND_SUCCESS',
  FETCH_BUILDING_EVENT_SCHEDULE = 'FETCH_BUILDING_EVENT_SCHEDULE',
  FETCH_BUILDING_EVENT_SCHEDULE_ERROR = 'FETCH_BUILDING_EVENT_SCHEDULE_ERROR',
  FETCH_BUILDING_EVENT_SCHEDULE_SUCCESS = 'FETCH_BUILDING_EVENT_SCHEDULE_SUCCESS',
  FETCH_BUILDINGS = 'FETCH_BUILDINGS',
  FETCH_BUILDINGS_ERROR = 'FETCH_BUILDINGS_ERROR',
  FETCH_BUILDINGS_SUCCESS = 'FETCH_BUILDINGS_SUCCESS',
  FETCH_COSTS_AND_SAVINGS_CHART = 'FETCH_COSTS_AND_SAVINGS_CHART',
  FETCH_COSTS_AND_SAVINGS_CHART_ERROR = 'FETCH_COSTS_AND_SAVINGS_CHART_ERROR',
  FETCH_COSTS_AND_SAVINGS_CHART_SUCCESS = 'FETCH_COSTS_AND_SAVINGS_CHART_SUCCESS',
  FETCH_ENERGY_CONSUMPTION_CHART = 'FETCH_ENERGY_CONSUMPTION_CHART',
  FETCH_ENERGY_CONSUMPTION_CHART_ERROR = 'FETCH_ENERGY_CONSUMPTION_CHART_ERROR',
  FETCH_ENERGY_CONSUMPTION_CHART_SUCCESS = 'FETCH_ENERGY_CONSUMPTION_CHART_SUCCESS',
  FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON = 'FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON',
  FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_ERROR = 'FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_ERROR',
  FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_SUCCESS = 'FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_SUCCESS',
  FETCH_ENERGY_COST_PER_CAPITA_CHART = 'FETCH_ENERGY_COST_PER_CAPITA_CHART',
  FETCH_ENERGY_COST_PER_CAPITA_CHART_ERROR = 'FETCH_ENERGY_COST_PER_CAPITA_CHART_ERROR',
  FETCH_ENERGY_COST_PER_CAPITA_CHART_SUCCESS = 'FETCH_ENERGY_COST_PER_CAPITA_CHART_SUCCESS',
  FETCH_ENERGY_DEMAND_CHART = 'FETCH_ENERGY_DEMAND_CHART',
  FETCH_ENERGY_DEMAND_CHART_ERROR = 'FETCH_ENERGY_DEMAND_CHART_ERROR',
  FETCH_ENERGY_DEMAND_CHART_SUCCESS = 'FETCH_ENERGY_DEMAND_CHART_SUCCESS',
  FETCH_ENERGY_DEMAND_YEAR_COMPARISON = 'FETCH_ENERGY_DEMAND_YEAR_COMPARISON',
  FETCH_ENERGY_DEMAND_YEAR_COMPARISON_ERROR = 'FETCH_ENERGY_DEMAND_YEAR_COMPARISON_ERROR',
  FETCH_ENERGY_DEMAND_YEAR_COMPARISON_SUCCESS = 'FETCH_ENERGY_DEMAND_YEAR_COMPARISON_SUCCESS',
  FETCH_ENERGY_STAR_RATINGS = 'FETCH_ENERGY_STAR_RATINGS',
  FETCH_ENERGY_STAR_RATINGS_ERROR = 'FETCH_ENERGY_STAR_RATINGS_ERROR',
  FETCH_ENERGY_STAR_RATINGS_SUCCESS = 'FETCH_ENERGY_STAR_RATINGS_SUCCESS',
  FETCH_ENERGY_USAGE_PER_CAPITA_CHART = 'FETCH_ENERGY_USAGE_PER_CAPITA_CHART',
  FETCH_ENERGY_USAGE_PER_CAPITA_CHART_ERROR = 'FETCH_ENERGY_USAGE_PER_CAPITA_CHART_ERROR',
  FETCH_ENERGY_USAGE_PER_CAPITA_CHART_SUCCESS = 'FETCH_ENERGY_USAGE_PER_CAPITA_CHART_SUCCESS',
  FETCH_EXPORT_YEAR_COMPARISON = 'FETCH_EXPORT_YEAR_COMPARISON',
  FETCH_EXPORT_YEAR_COMPARISON_ERROR = 'FETCH_EXPORT_YEAR_COMPARISON_ERROR',
  FETCH_EXPORT_YEAR_COMPARISON_SUCCESS = 'FETCH_EXPORT_YEAR_COMPARISON_SUCCESS',
  FETCH_GREENHOUSE_GAS_EMISSIONS = 'FETCH_GREENHOUSE_GAS_EMISSIONS',
  FETCH_GREENHOUSE_GAS_EMISSIONS_ERROR = 'FETCH_GREENHOUSE_GAS_EMISSIONS_ERROR',
  FETCH_GREENHOUSE_GAS_EMISSIONS_SUCCESS = 'FETCH_GREENHOUSE_GAS_EMISSIONS_SUCCESS',
  FETCH_SOLAR_GENERATION_YEAR_COMPARISON = 'FETCH_SOLAR_GENERATION_YEAR_COMPARISON',
  FETCH_SOLAR_GENERATION_YEAR_COMPARISON_ERROR = 'FETCH_SOLAR_GENERATION_YEAR_COMPARISON_ERROR',
  FETCH_SOLAR_GENERATION_YEAR_COMPARISON_SUCCESS = 'FETCH_SOLAR_GENERATION_YEAR_COMPARISON_SUCCESS',
}

interface ChangeActiveBuilding {
  type: typeof BuildingActionEnum.CHANGE_ACTIVE_BUILDING;
  payload: BuildingModel;
}

interface FetchBuildingAction {
  type: typeof BuildingActionEnum.FETCH_BUILDINGS;
}

interface FetchBuildingSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDINGS_SUCCESS;
  payload: BuildingDocument[];
}

interface FetchBuildingError {
  type: typeof BuildingActionEnum.FETCH_BUILDINGS_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingAnalyticsBoxesAction {
    type: typeof BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES;
}

interface FetchBuildingAnalyticsBoxesSuccess {
    type: typeof BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_SUCCESS;
    payload: string[];
}

interface FetchBuildingAnalyticsBoxesError {
    type: typeof BuildingActionEnum.FETCH_BUILDING_ANALYTICS_BOXES_ERROR;
    payload: {
        loading: false;
        error: any;
    };
}

interface FetchBuildingEnergyDemand {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND;
}

interface FetchBuildingEnergyDemandSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_SUCCESS;
  payload: EnergyDemandDocument;
}

interface FetchBuildingEnergyDemandError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_DEMAND_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingEventSchedule {
  type: typeof BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE;
}

interface FetchBuildingEventScheduleSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_SUCCESS;
  payload: EventScheduleDocument[];
}

interface FetchBuildingEventScheduleError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_EVENT_SCHEDULE_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingEnergyAllocation {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION;
}

interface FetchBuildingEnergyAllocationSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_SUCCESS;
  payload: EnergyAllocationDocument[];
}

interface FetchBuildingEnergyAllocationError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ENERGY_ALLOCATION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnnualBuildingEnergyDemand {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND;
}

interface FetchAnnualBuildingEnergyDemandSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_SUCCESS;
  payload: BuildingEngineerAnalyticsDocument[];
}

interface FetchAnnualBuildingEnergyDemandError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_DEMAND_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnnualBuildingEnergyConsumption {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION;
}

interface FetchAnnualBuildingEnergyConsumptionSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_SUCCESS;
  payload: BuildingEngineerAnalyticsDocument[];
}

interface FetchAnnualBuildingEnergyConsumptionError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_ENERGY_CONSUMPTION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingAnnualExport {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT;
}

interface FetchBuildingAnnualExportSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_SUCCESS;
  payload: BuildingEngineerAnalyticsDocument[];
}

interface FetchBuildingAnnualExportError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ANNUAL_EXPORT_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchExportYearComparison {
  type: typeof BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON;
}

interface FetchExportYearComparisonSuccess {
  type: typeof BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_SUCCESS;
  payload: {
    exportYearComparisonDocument: BuildingEngineerAnalyticsChartDocument;
    year1: number;
    year2: number;
    unit: string;
  };
}

interface FetchExportYearComparisonError {
  type: typeof BuildingActionEnum.FETCH_EXPORT_YEAR_COMPARISON_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnnualSolarGeneration {
  type: typeof BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION;
}

interface FetchAnnualSolarGenerationSuccess {
  type: typeof BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_SUCCESS;
  payload: BuildingEngineerAnalyticsDocument[];
}

interface FetchAnnualSolarGenerationError {
  type: typeof BuildingActionEnum.FETCH_ANNUAL_SOLAR_GENERATION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingAssetNames {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES;
}

interface FetchBuildingAssetNamesSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_SUCCESS;
  payload: string[];
}

interface FetchBuildingAssetNamesError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_NAMES_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingAssetDropdownOptions {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS;
}

interface FetchBuildingAssetDropdownOptionsSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_SUCCESS;
  payload: any;
}

interface FetchBuildingAssetDropdownOptionsError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_DROPDOWN_OPTIONS_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBuildingAssetChartValues {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES;
}

interface FetchBuildingAssetChartValuesSuccess {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_SUCCESS;
  payload: any;
}

interface FetchBuildingAssetChartValuesError {
  type: typeof BuildingActionEnum.FETCH_BUILDING_ASSET_CHART_VALUES_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchGreenhouseGasEmissions {
  type: typeof BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS;
}

interface FetchGreenhouseGasEmissionsSuccess {
  type: typeof BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_SUCCESS;
  payload: GreenhouseGasEmissionDocument[];
}

interface FetchGreenhouseGasEmissionsError {
  type: typeof BuildingActionEnum.FETCH_GREENHOUSE_GAS_EMISSIONS_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyStarRatings {
  type: typeof BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS;
}

interface FetchEnergyStarRatingsSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_SUCCESS;
  payload: EnergyStarRatingDocument[];
}

interface FetchEnergyStarRatingsError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_STAR_RATINGS_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnalyticsCostAndSaving {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING;
}

interface FetchAnalyticsCostAndSavingSuccess {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_SUCCESS;
  payload: AnalyticsSuperDocument;
}

interface FetchAnalyticsCostAndSavingError {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_COST_AND_SAVING_ERROR;
  payload: {
    error: any;
  };
}

interface FetchAnalyticsEnergyDemand {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND;
}

interface FetchAnalyticsEnergyDemandSuccess {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_SUCCESS;
  payload: AnalyticsSuperDocument;
}

interface FetchAnalyticsEnergyDemandError {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_DEMAND_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnalyticsEnergyConsumption {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION;
}

interface FetchAnalyticsEnergyConsumptionSuccess {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_SUCCESS;
  payload: AnalyticsSuperDocument;
}

interface FetchAnalyticsEnergyConsumptionError {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_CONSUMPTION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnalyticsEnergyUsagePerCapita {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA;
}

interface FetchAnalyticsEnergyUsagePerCapitaSuccess {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_SUCCESS;
  payload: AnalyticsSuperDocument;
}

interface FetchAnalyticsEnergyUsagePerCapitaError {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_USAGE_PER_CAPITA_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchAnalyticsEnergyCostPerCapita {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA;
}

interface FetchAnalyticsEnergyCostPerCapitaSuccess {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_SUCCESS;
  payload: AnalyticsSuperDocument;
}

interface FetchAnalyticsEnergyCostPerCapitaError {
  type: typeof BuildingActionEnum.FETCH_ANALYTICS_ENERGY_COST_PER_CAPITA_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyDemandYearComparison {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON;
}

interface FetchEnergyDemandYearComparisonSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_SUCCESS;
  payload: {
    energyDemandYearComparisonDocument: BuildingEngineerAnalyticsChartDocument;
    year1: number;
    year2: number;
    unit: string;
  };
}

interface FetchEnergyDemandYearComparisonError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_YEAR_COMPARISON_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchSolarGenerationYearComparison {
  type: typeof BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON;
}

interface FetchSolarGenerationYearComparisonSuccess {
  type: typeof BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_SUCCESS;
  payload: {
    solarGenerationYearComparisonDocument: BuildingEngineerAnalyticsChartDocument;
    year1: number;
    year2: number;
    unit: string;
  };
}

interface FetchSolarGenerationYearComparisonError {
  type: typeof BuildingActionEnum.FETCH_SOLAR_GENERATION_YEAR_COMPARISON_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyConsumptionYearComparison {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON;
}

interface FetchEnergyConsumptionYearComparisonSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_SUCCESS;
  payload: {
    energyConsumptionYearComparisonDocument: EnergyConsumptionYearComparisonDocument;
    year1: number;
    year2: number;
    unit: string;
  };
}

interface FetchEnergyConsumptionYearComparisonError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_YEAR_COMPARISON_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchCostsAndSavingsChart {
  type: typeof BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART;
}

interface FetchCostsAndSavingsChartSuccess {
  type: typeof BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_SUCCESS;
  payload: {
    chartCostsAndSavingsDocument: SuperAnalyticsChartDocument;
  };
}

interface FetchCostsAndSavingsChartError {
  type: typeof BuildingActionEnum.FETCH_COSTS_AND_SAVINGS_CHART_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyDemandChart {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART;
}

interface FetchEnergyDemandChartSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_SUCCESS;
  payload: {
    chartEnergyDemandDocument: SuperAnalyticsChartDocument;
  };
}

interface FetchEnergyDemandChartError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_DEMAND_CHART_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyConsumptionChart {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART;
}

interface FetchEnergyConsumptionChartSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_SUCCESS;
  payload: {
    chartEnergyConsumptionDocument: SuperAnalyticsChartDocument;
  };
}

interface FetchEnergyConsumptionChartError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_CONSUMPTION_CHART_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyUsagePerCapitaChart {
  type: typeof BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART;
}

interface FetchEnergyUsagePerCapitaChartSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_SUCCESS;
  payload: {
    chartEnergyUsagePerCapitaDocument: SuperAnalyticsChartDocument;
  };
}

interface FetchEnergyUsagePerCapitaChartError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_USAGE_PER_CAPITA_CHART_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchEnergyCostPerCapitaChart {
  type: typeof BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART;
}

interface FetchEnergyCostPerCapitaChartSuccess {
  type: typeof BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_SUCCESS;
  payload: {
    chartEnergyCostPerCapitaDocument: SuperAnalyticsChartDocument;
  };
}

interface FetchEnergyCostPerCapitaChartError {
  type: typeof BuildingActionEnum.FETCH_ENERGY_COST_PER_CAPITA_CHART_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

export type BuildingsActionTypes =
  | ChangeActiveBuilding
  | FetchAnalyticsCostAndSaving
  | FetchAnalyticsCostAndSavingError
  | FetchAnalyticsCostAndSavingSuccess
  | FetchAnalyticsEnergyConsumption
  | FetchAnalyticsEnergyConsumptionError
  | FetchAnalyticsEnergyConsumptionSuccess
  | FetchAnalyticsEnergyCostPerCapita
  | FetchAnalyticsEnergyCostPerCapitaError
  | FetchAnalyticsEnergyCostPerCapitaSuccess
  | FetchAnalyticsEnergyDemand
  | FetchAnalyticsEnergyDemandError
  | FetchAnalyticsEnergyDemandSuccess
  | FetchAnalyticsEnergyUsagePerCapita
  | FetchAnalyticsEnergyUsagePerCapitaError
  | FetchAnalyticsEnergyUsagePerCapitaSuccess
  | FetchAnnualBuildingEnergyConsumption
  | FetchAnnualBuildingEnergyConsumptionError
  | FetchAnnualBuildingEnergyConsumptionSuccess
  | FetchAnnualBuildingEnergyDemand
  | FetchAnnualBuildingEnergyDemandError
  | FetchAnnualBuildingEnergyDemandSuccess
  | FetchAnnualSolarGeneration
  | FetchAnnualSolarGenerationError
  | FetchAnnualSolarGenerationSuccess
  | FetchBuildingAction
  | FetchBuildingAnalyticsBoxesAction
  | FetchBuildingAnalyticsBoxesError
  | FetchBuildingAnalyticsBoxesSuccess
  | FetchBuildingAnnualExport
  | FetchBuildingAnnualExportError
  | FetchBuildingAnnualExportSuccess
  | FetchBuildingAssetChartValues
  | FetchBuildingAssetChartValuesError
  | FetchBuildingAssetChartValuesSuccess
  | FetchBuildingAssetDropdownOptions
  | FetchBuildingAssetDropdownOptionsError
  | FetchBuildingAssetDropdownOptionsSuccess
  | FetchBuildingAssetNames
  | FetchBuildingAssetNamesError
  | FetchBuildingAssetNamesSuccess
  | FetchBuildingEnergyAllocation
  | FetchBuildingEnergyAllocationError
  | FetchBuildingEnergyAllocationSuccess
  | FetchBuildingEnergyDemand
  | FetchBuildingEnergyDemandError
  | FetchBuildingEnergyDemandSuccess
  | FetchBuildingError
  | FetchBuildingEventSchedule
  | FetchBuildingEventScheduleError
  | FetchBuildingEventScheduleSuccess
  | FetchBuildingSuccess
  | FetchCostsAndSavingsChart
  | FetchCostsAndSavingsChartError
  | FetchCostsAndSavingsChartSuccess
  | FetchEnergyConsumptionChart
  | FetchEnergyConsumptionChartError
  | FetchEnergyConsumptionChartSuccess
  | FetchEnergyConsumptionYearComparison
  | FetchEnergyConsumptionYearComparisonError
  | FetchEnergyConsumptionYearComparisonSuccess
  | FetchEnergyCostPerCapitaChart
  | FetchEnergyCostPerCapitaChartError
  | FetchEnergyCostPerCapitaChartSuccess
  | FetchEnergyDemandChart
  | FetchEnergyDemandChartError
  | FetchEnergyDemandChartSuccess
  | FetchEnergyDemandYearComparison
  | FetchEnergyDemandYearComparisonError
  | FetchEnergyDemandYearComparisonSuccess
  | FetchEnergyStarRatings
  | FetchEnergyStarRatingsError
  | FetchEnergyStarRatingsSuccess
  | FetchEnergyUsagePerCapitaChart
  | FetchEnergyUsagePerCapitaChartError
  | FetchEnergyUsagePerCapitaChartSuccess
  | FetchExportYearComparison
  | FetchExportYearComparisonError
  | FetchExportYearComparisonSuccess
  | FetchGreenhouseGasEmissions
  | FetchGreenhouseGasEmissionsError
  | FetchGreenhouseGasEmissionsSuccess
  | FetchSolarGenerationYearComparison
  | FetchSolarGenerationYearComparisonError
  | FetchSolarGenerationYearComparisonSuccess;
