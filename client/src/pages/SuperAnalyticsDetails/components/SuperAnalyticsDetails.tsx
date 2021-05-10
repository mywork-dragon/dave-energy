import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Calendar, Layout } from 'components';
import {
  NormalizationSelector,
  SuperAnalyticsChartComponent,
  ChartData,
  SectionSelector,
} from '.';
import {
  colors,
  Flex,
  IconElectricity,
  LegendButton,
  UtilityButton,
} from 'design-system';
import { SuperAnalyticsTitle } from '../types';
import { SuperAnalyticsChartModel } from 'models';
import {
  getCostsAndSavingsChart,
  getEnergyConsumptionChart,
  getEnergyCostPerCapitaChart,
  getEnergyDemandChart,
  getEnergyUsagePerCapitaChart,
} from 'store/buildings';
import { RootState } from 'store';


const getCurrentYear = (chart: SuperAnalyticsChartModel | null): string => {
  if (chart) {
    for (const energyType in chart) {
      if (chart[energyType].hasOwnProperty('currentYear')) {
        return chart[energyType]['currentYear']['year'].toString();
      }
    }
  }
  return 'DEMAND'
};

const TITLE_TO_CHART_KEY_MAP = {
  'Costs and Savings': ['chartCostsAndSavings', getCostsAndSavingsChart],
  'Energy Consumption': ['chartEnergyConsumption', getEnergyConsumptionChart],
  'Energy Cost per capita': ['chartEnergyCostPerCapita', getEnergyCostPerCapitaChart],
  'Energy Demand': ['chartEnergyDemand', getEnergyDemandChart],
  'Energy Usage per capita': ['chartEnergyUsagePerCapita', getEnergyUsagePerCapitaChart],
};

interface Props {
  title: SuperAnalyticsTitle;
}

export const SuperAnalyticsDetails: React.FC<Props> = ({ title }: Props) => {
  const dispatch = useDispatch();
  const buildingId = useSelector(({ buildings }: RootState) => buildings.activeBuilding?.id);
  const [isTemperatureNormalized, setIsTemperatureNormalized] = useState<number>(0);

  const toggleIsTemperatureNormalized = () => {
    setIsTemperatureNormalized(prevState => (prevState === 0 ? 1 : 0));
  };

  const chartStoreKey = TITLE_TO_CHART_KEY_MAP[title][0];
  const action = TITLE_TO_CHART_KEY_MAP[title][1];
  const chart = useSelector(({ buildings }: RootState) => buildings?.[chartStoreKey] ?? null);

  useEffect(() => {
    if (buildingId && title) {
      dispatch(action({ buildingId, isTemperatureNormalized }));
    }
  }, [buildingId, title, isTemperatureNormalized]);

  return (
    <Layout isHeaderSticky>
      <SuperAnalyticsHeader alignItems='center' justifyContent='space-between'>
        <Calendar dateDisplayFormat='year' showYearPicker />
        <NormalizationSelector
          isTemperatureNormalized={isTemperatureNormalized}
          toggleIsTemperatureNormalized={toggleIsTemperatureNormalized}
        />
      </SuperAnalyticsHeader>
      <div style={{'position': 'relative', 'padding': '0 50.5px 59.5px 50.5px'}}>
        <SectionSelector sectionTitle={title} />
        <ChartHeader css='height: max-content;' alignItems='center' justifyContent='space-between'>
          <UtilityButton Icon={IconElectricity} isActive>
            Electricity
          </UtilityButton>
          <span>
            <LegendButton isActive activeColor={colors.hvac}>
              LAST YEAR
            </LegendButton>
            <LegendButton isActive activeColor={colors.blue}>
              {getCurrentYear(chart)}
            </LegendButton>
          </span>
        </ChartHeader>
        <ChartData
          currentYear={chart?.electricity?.currentYear}
          lastYear={chart?.electricity?.lastYear}
          ptcChange={chart?.electricity?.pctChange}
        />
        <SuperAnalyticsChartComponent superAnalyticsChart={chart} />
      </div>
    </Layout>
  );
};

const SuperAnalyticsHeader = styled(Flex)`
  position: sticky;
  top: 80px;
  margin-bottom: 40px;
  padding: 18px 46px;
  box-shadow: 0 30px 30px -30px rgba(87, 94, 104, 0.1);
  height: 129px;
  background-color: ${colors.white};
  z-index: 3;
`;

const ChartHeader = styled(Flex)`
  position: relative;
  border-bottom: 1px solid ${colors.grayEEF3FA};
  height: 83px;
  width: inherit;
`;
