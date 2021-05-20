import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { RootState } from 'store';
import { RoutePaths } from 'routes';
import {
  getAnalyticsCostAndSaving,
  getAnalyticsEnergyConsumption,
  getAnalyticsEnergyCostPerCapita,
  getAnalyticsEnergyDemand,
  getAnalyticsEnergyUsagePerCapita,
} from 'store/buildings';
import { AnalyticsSuperModel } from 'models';
import { Layout } from 'components';
import { AnalyticsCardTitle, SuperAnalyticsIcons } from './components';
import { colors, Flex, Spinner, Title } from 'design-system';
import { useAnalyticsToggle } from './components/hooks';
import { getPtcColor } from 'utils';


interface AnalyticsCardRowProps {
  title?: string | null;
  percent?: string | null;
}

const AnalyticsCardRow = ({
  title,
  percent,
}: AnalyticsCardRowProps) => {
  if (!title || !percent) {
    return null;
  }

  const ptcColor = getPtcColor(percent);
  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <Title>{title}</Title>
      <Percentage ptcColor={ptcColor}>{percent}</Percentage>
    </Flex>
  );
};

interface BigBlockProps {
  analyticsSuperData: AnalyticsSuperModel | null;
  loading: boolean;
  path: string;
  title: string;
}

export const BigBlock = ({
  analyticsSuperData,
  loading,
  path,
  title,
}: BigBlockProps) => {
  const { pctChange, unit, value, subtitle, toSwitch } = useAnalyticsToggle(analyticsSuperData);

  return (
    <AnalyticsCard isBig>
      <AnalyticsCardTitle text={title} grayText={subtitle} path={path} onClick={toSwitch} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Quantity unit={unit} value={value} isBig />
          <AnalyticsCardRow title={title} percent={pctChange} />
        </>
      )}
    </AnalyticsCard>
  );
};


interface SmallBlockProps {
  analyticsSuperData: AnalyticsSuperModel | null;
  loading: boolean;
  path: string;
  title: string;
}

export const SmallBlock = ({
  analyticsSuperData,
  loading,
  path,
  title,
}: SmallBlockProps) => {
  const { pctChange, unit, value, subtitle, toSwitch } = useAnalyticsToggle(analyticsSuperData);

  return (
    <AnalyticsCard>
      <AnalyticsCardTitle text={title} grayText={subtitle} path={path} onClick={toSwitch} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <SuperAnalyticsIcons icons={[{ name: 'electricity', isActive: true }]} />
          <Quantity unit={unit} value={value} />
          <AnalyticsCardRow title='Electricity' percent={pctChange} />
        </>
      )}
    </AnalyticsCard>
  );
};


interface StoreStateProps {
  activeBuildingId: number | null;
  analyticsCostAndSaving: AnalyticsSuperModel | null;
  analyticsCostAndSavingLoading: boolean;
  analyticsEnergyDemand: AnalyticsSuperModel | null;
  analyticsEnergyDemandLoading: boolean;
  analyticsEnergyConsumption: AnalyticsSuperModel | null;
  analyticsEnergyConsumptionLoading: boolean;
  analyticsEnergyUsagePerCapita: AnalyticsSuperModel | null;
  analyticsEnergyUsagePerCapitaLoading: boolean;
  analyticsEnergyCostPerCapita: AnalyticsSuperModel | null;
  analyticsEnergyCostPerCapitaLoading: boolean;
}

interface StoreDispatchProps {
  getAnalyticsCostAndSaving: typeof getAnalyticsCostAndSaving;
  getAnalyticsEnergyDemand: typeof getAnalyticsEnergyDemand;
  getAnalyticsEnergyConsumption: typeof getAnalyticsEnergyConsumption;
  getAnalyticsEnergyUsagePerCapita: typeof getAnalyticsEnergyUsagePerCapita;
  getAnalyticsEnergyCostPerCapita: typeof getAnalyticsEnergyCostPerCapita;
}

type Props = StoreStateProps & StoreDispatchProps;

export const SuperAnalyticsComponent = ({
  activeBuildingId,
  analyticsCostAndSaving,
  analyticsCostAndSavingLoading,
  analyticsEnergyConsumption,
  analyticsEnergyConsumptionLoading,
  analyticsEnergyCostPerCapita,
  analyticsEnergyCostPerCapitaLoading,
  analyticsEnergyDemand,
  analyticsEnergyDemandLoading,
  analyticsEnergyUsagePerCapita,
  analyticsEnergyUsagePerCapitaLoading,
  getAnalyticsCostAndSaving,
  getAnalyticsEnergyConsumption,
  getAnalyticsEnergyCostPerCapita,
  getAnalyticsEnergyDemand,
  getAnalyticsEnergyUsagePerCapita,
}: Props) => {
  useEffect(() => {
    if (activeBuildingId) {
      getAnalyticsData(activeBuildingId);
    }
  }, [activeBuildingId]);

  const getAnalyticsData = (activeBuildingId: number) => {
    getAnalyticsCostAndSaving(activeBuildingId);
    getAnalyticsEnergyConsumption(activeBuildingId);
    getAnalyticsEnergyCostPerCapita(activeBuildingId);
    getAnalyticsEnergyDemand(activeBuildingId);
    getAnalyticsEnergyUsagePerCapita(activeBuildingId);
  };

  return (
    <Layout>
      <AnalyticsPageContainer>
        <LeftBigBlock>
          <BigBlock
            title='Costs and Savings'
            loading={analyticsCostAndSavingLoading}
            analyticsSuperData={analyticsCostAndSaving}
            path={RoutePaths.analyticsManagementCostsAndSaving}
          />
        </LeftBigBlock>

        <div>
          <SmallBlock
            title='Energy Demand'
            loading={analyticsEnergyDemandLoading}
            analyticsSuperData={analyticsEnergyDemand}
            path={RoutePaths.analyticsManagementEnergyDemand}
          />
        </div>

        <div />

        <RightBigBlock>
          <div />
        </RightBigBlock>

        <div>
          <SmallBlock
            title='Energy Consumption'
            loading={analyticsEnergyConsumptionLoading}
            analyticsSuperData={analyticsEnergyConsumption}
            path={RoutePaths.analyticsManagementEnergyConsumption}
          />
        </div>

        <div />

        <div>
          <SmallBlock
            title='Energy Usage per capita'
            loading={analyticsEnergyUsagePerCapitaLoading}
            analyticsSuperData={analyticsEnergyUsagePerCapita}
            path={RoutePaths.analyticsManagementEnergyUsagePerCapita}
          />
        </div>

        <div>
          <SmallBlock
            title='Energy Cost per capita'
            loading={analyticsEnergyCostPerCapitaLoading}
            analyticsSuperData={analyticsEnergyCostPerCapita}
            path={RoutePaths.analyticsManagementEnergyCostPerCapita}
          />
        </div>

        <div />
        <div />
      </AnalyticsPageContainer>
    </Layout>
  );
};

interface AnalyticsCardProps {
  isBig?: boolean;
}

const AnalyticsCard = styled.div<AnalyticsCardProps>`
  height: ${({ isBig = false }) => (isBig ? '450px' : '200px')};
  width: 360px;
  border-radius: 2px;
  background-color: ${colors.white};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.1);
  padding: 21.5px 30.5px 32px 30.5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AnalyticsPageContainer = styled.div`
  padding: 59.5px 50.5px;
  display: inline-grid;
  gap: 46px;
  grid-template-columns: repeat(4, 360px);
  grid-template-rows: repeat(3, 200px);
`;

const LeftBigBlock = styled.div`
  grid-row: 1 / 3;
  grid-column: 1 / 2;
`;

const RightBigBlock = styled.div`
  grid-row: 1 / 3;
  grid-column: 4 / 5;
`;

interface PercentageProps {
  ptcColor: string;
}

const Percentage = styled.div<PercentageProps>`
  font-family: Aktiv Grotesk;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: ${({ ptcColor }): string => ptcColor};
`;

interface QuantityProps {
  value?: string | null;
  unit?: string | null;
  isBig?: boolean;
}

const Quantity = ({ value, unit, isBig }: QuantityProps) => {
  const displayedUnit = value && value !== 'NA' ? unit : null;
  return (
    <StyledQuantity unit={displayedUnit} isBig={isBig}>
      {value}
    </StyledQuantity>
  );
};

type StyledQuantityProps = Pick<QuantityProps, 'unit' | 'isBig'>;

const StyledQuantity = styled.div<StyledQuantityProps>`
  font-family: Aktiv Grotesk;
  font-size: ${({ isBig }): string => (isBig ? '65px' : '31px')};
  font-weight: 500;
  line-height: 39px;
  color: ${colors.blue};

  ${({ unit, isBig }): string =>
    unit
      ? `&:after {
    content: '${unit}';
    font-size: 13px;
    bottom: ${isBig ? '35px' : '12px'};
    position: relative;
    margin-left: 6px;
  }`
      : ''}
`;

function mapStateToProps({ buildings }: RootState): StoreStateProps {
  return {
    activeBuildingId: buildings?.activeBuilding?.id ?? null,
    analyticsCostAndSaving: buildings?.analyticsCostAndSaving ?? null,
    analyticsCostAndSavingLoading: buildings.analyticsCostAndSavingLoading,
    analyticsEnergyDemand: buildings?.analyticsEnergyDemand ?? null,
    analyticsEnergyDemandLoading: buildings.analyticsEnergyDemandLoading,
    analyticsEnergyConsumption: buildings?.analyticsEnergyConsumption ?? null,
    analyticsEnergyConsumptionLoading: buildings.analyticsEnergyConsumptionLoading,
    analyticsEnergyUsagePerCapita: buildings?.analyticsEnergyUsagePerCapita ?? null,
    analyticsEnergyUsagePerCapitaLoading: buildings.analyticsEnergyUsagePerCapitaLoading,
    analyticsEnergyCostPerCapita: buildings?.analyticsEnergyCostPerCapita ?? null,
    analyticsEnergyCostPerCapitaLoading: buildings.analyticsEnergyCostPerCapitaLoading,
  };
}

function mapDispatchToProps(dispatch: any): StoreDispatchProps {
  return {
    getAnalyticsCostAndSaving: buildingId => dispatch(getAnalyticsCostAndSaving(buildingId)),
    getAnalyticsEnergyDemand: buildingId => dispatch(getAnalyticsEnergyDemand(buildingId)),
    getAnalyticsEnergyConsumption: buildingId => dispatch(getAnalyticsEnergyConsumption(buildingId)),
    getAnalyticsEnergyUsagePerCapita: buildingId => dispatch(getAnalyticsEnergyUsagePerCapita(buildingId)),
    getAnalyticsEnergyCostPerCapita: buildingId => dispatch(getAnalyticsEnergyCostPerCapita(buildingId)),
  };
}

export const SuperAnalyticsPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SuperAnalyticsComponent);
