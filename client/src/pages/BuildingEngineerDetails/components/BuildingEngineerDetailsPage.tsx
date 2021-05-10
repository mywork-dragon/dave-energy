import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'store';
import { Layout } from 'components/Layouts';
import { EngineerAnalyticsTitle, SectionSelector } from 'components/EngineerAnalytics';
import { Calendar } from 'components';
import { ChartComponent } from '.';
import { useBuildingEngineer } from '../hooks/useBuildingEngineer';
import {
  colors,
  Flex,
  IconElectricity,
  LegendButton,
  UtilityButton,
} from 'design-system';

interface Props {
  title: EngineerAnalyticsTitle;
}

export const BuildingEngineerDetailsPage: React.FC<Props> = ({ title }) => {
  const [getData, model] = useBuildingEngineer(title);
  const dispatch = useDispatch();
  const buildingId = useSelector((state: RootState) => state.buildings.activeBuilding?.id);
  const date = useSelector((state: RootState) => state.time.instance);

  const comparisonYear = useMemo(
    () =>
      new Date().getFullYear() === date.getFullYear()
        ? 'LAST YEAR'
        : (date.getFullYear() - 1).toString(),
    [date],
  );

  useEffect(() => {
    if (buildingId) {
      dispatch(getData(buildingId, date.getFullYear(), date.getFullYear() - 1));
    }
  }, [buildingId, date]);

  return (
    <Layout isHeaderSticky>
      <BuildingEngineerDetailsHeader alignItems='center' justifyContent='space-between'>
        <Calendar dateDisplayFormat='year' showYearPicker />
      </BuildingEngineerDetailsHeader>
      <div style={{'position': 'relative', 'padding': '0 50.5px 59.5px 50.5px'}}>
        <SectionSelector sectionTitle={title} />
        <ChartHeader css='height: max-content;' alignItems='center' justifyContent='space-between'>
          <UtilityButton Icon={IconElectricity} isActive>
            Electricity
          </UtilityButton>
          <Flex alignItems='center'>
            <LegendButton isActive activeColor={colors.hvac}>
              {comparisonYear.toString()}
            </LegendButton>
            <LegendButton isActive activeColor={colors.blue}>
              METER
            </LegendButton>
          </Flex>
        </ChartHeader>
        <ChartComponent model={model} />
      </div>
    </Layout>
  );
};

const BuildingEngineerDetailsHeader = styled(Flex)`
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
