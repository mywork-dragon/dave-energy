import { useSelector } from 'react-redux';

import { BuildingEngineerAnalyticsChartModel } from 'models';
import { BuildingsState } from 'store/buildings';
import { RootState } from 'store';

import {
  getEnergyDemandYearComparison,
  getEnergyConsumptionYearComparison,
  getExportYearComparison,
  getSolarGenerationYearComparison,
} from 'store/buildings';

enum EngineerAnalyticsTitle {
  annualExport = 'Annual Export',
  assets = 'Assets',
  energyDemand = 'Energy Demand',
  energyConsumption = 'Energy Consumption',
  solarGeneration = 'Solar Generation',
}

type BuildingEngineerGetData =
  | typeof getEnergyDemandYearComparison
  | typeof getEnergyConsumptionYearComparison
  | typeof getExportYearComparison
  | typeof getSolarGenerationYearComparison;

type UseBuildingEngineer = (
  title: EngineerAnalyticsTitle,
) => [
  BuildingEngineerGetData,
  BuildingEngineerAnalyticsChartModel | undefined | null,
];

const titleToGetDataMap: Partial<Record<
  EngineerAnalyticsTitle,
  BuildingEngineerGetData
>> = {
  [EngineerAnalyticsTitle.annualExport]: getExportYearComparison,
  [EngineerAnalyticsTitle.energyConsumption]: getEnergyConsumptionYearComparison,
  [EngineerAnalyticsTitle.energyDemand]: getEnergyDemandYearComparison,
  [EngineerAnalyticsTitle.solarGeneration]: getSolarGenerationYearComparison,
};

const titleToBuildingsKey: Partial<Record<
  EngineerAnalyticsTitle,
  keyof BuildingsState
>> = {
  [EngineerAnalyticsTitle.annualExport]: 'exportYearComparison',
  [EngineerAnalyticsTitle.energyConsumption]: 'energyConsumptionYearComparison',
  [EngineerAnalyticsTitle.energyDemand]: 'energyDemandYearComparison',
  [EngineerAnalyticsTitle.solarGeneration]: 'solarGenerationYearComparison',
};

export const useBuildingEngineer: UseBuildingEngineer = title => {
  const model = useSelector(
    (state: RootState) => state.buildings[titleToBuildingsKey[title]!],
  );
  const getData = titleToGetDataMap[title]!;
  return [getData, model];
};
