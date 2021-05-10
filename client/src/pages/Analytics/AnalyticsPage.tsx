import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { isEmpty, isNull } from 'lodash';

import generateChartOptions from './generateChartOptions';
import { CardChartCategories } from 'components';
import { Layout } from 'components/Layouts';
import { deviceToIconMap } from 'models';
import {
  getAnnualEnergyDemand,
  getAnnualEnergyConsumption,
  getAnnualExport,
  getAnnualSolarGeneration,
  getBuildingAnalyticsBoxes,
  getBuildingAssetNames,
} from 'store/buildings';
import { RoutePaths } from 'routes';
import { RootState } from 'store';
import {
  colors,
  Flex,
  IconArrowRight,
  IconElectricity,
  Spinner,
  Title,
} from 'design-system';


interface AnnualAnalyticsCardProps {
  className?: string;
  link: string;
  keyofBuildingsState:
    | 'annualEnergyDemand'
    | 'annualEnergyConsumption'
    | 'annualExport'
    | 'annualSolarGeneration';
  title: string;
}

const AnnualAnalyticsCard = ({
  className,
  link,
  keyofBuildingsState,
  title,
}: AnnualAnalyticsCardProps) => {
  const [chartOptions, setChartOptions] = useState<any>(generateChartOptions('kW'));
  const [quantity, setQuantity] = useState<string>('0');
  const [unit, setUnit] = useState<string>('kW');

  const models = useSelector(({ buildings }: RootState) => buildings?.[keyofBuildingsState] ?? null);

  useEffect(() => {
    if (isNull(models)) {
      setQuantity('0');
    } else {
      const unit = models.find(({ unit }) => unit).unit;
      const currentEnergyDemand = models.find(({ monthNumber }) => monthNumber === new Date().getMonth() + 1);
      setQuantity(Math.round(currentEnergyDemand?.quantity ?? 0).toLocaleString('en'));
      setUnit(unit);
      setChartOptions({
        ...generateChartOptions(unit),
        series: [{
          data: models.map(({ quantity }) => quantity ?? 0),
          type: 'column',
          color: colors.blue,
          name: 'Electricity',
          borderWidth: 1,
          borderRadius: 3,
          pointWidth: 5,
        }],
      });
    }
  }, [models]);

  return (
    <AnnualAnalyticsCardContainer className={className}>
      <div style={{'padding' : '21.5px 30.5px 32px 30.5px'}}>
        <Flex justifyContent='space-between'>
          <span>
            <Title css={`display: inline-block; margin-right: 28px;`}>
              {title}
            </Title>
            <Year>{new Date().getFullYear()}</Year>
          </span>
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            style={{'display': 'block', 'width': '30px', 'textAlign': 'right', 'cursor': 'pointer'}}
          >
            <IconArrowRight
              css='top: 4px; padding: 4px; margin: -4px;'
              color={colors.blue}
            />
          </a>
        </Flex>
        <IconElectricity css='margin-top: 20px;' color={colors.blue} />
        <Quantity unit={unit}>{quantity}</Quantity>
        <Title css={`margin-top: 12px;`}>Electricity</Title>
      </div>
      {isNull(models) ? (
        <Spinner />
      ) : (
        <>
          <CardChartCategories css='margin: 0 24px -16px 24px;' models={models} />
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </>
      )}
    </AnnualAnalyticsCardContainer>
  );
};

export const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const activeBuildingId = useSelector((state: RootState) => state.buildings.activeBuilding?.id);
  const assetNames = useSelector(({ buildings }: RootState) => buildings?.assetNames ?? []);
  const analyticsBoxes = useSelector(({ buildings }: RootState) => buildings?.analyticsBoxes ?? []);

  useEffect(() => {
    if (activeBuildingId) {
      dispatch(getBuildingAnalyticsBoxes(activeBuildingId));
      dispatch(getBuildingAssetNames(activeBuildingId));
    }
  }, [activeBuildingId]);

  useEffect(() => {
    if (!isEmpty(analyticsBoxes)) {
      analyticsBoxes.forEach(type => {
        switch (type) {
          case 'energy_consumption':
            dispatch(getAnnualEnergyConsumption(activeBuildingId!));
            break;
          case 'energy_demand':
            dispatch(getAnnualEnergyDemand(activeBuildingId!));
            break;
          case 'solar':
            dispatch(getAnnualSolarGeneration(activeBuildingId!));
            break;
          case 'export':
            dispatch(getAnnualExport(activeBuildingId!));
            break;
        }
      });
    }
  }, [analyticsBoxes]);

  const showAnalytics = (type: string) => analyticsBoxes.includes(type);

  return (
    <Layout>
      <div style={{'padding': '59.5px 50.5px'}}>
        <Flex>
          {showAnalytics('energy_demand') && (
            <AnnualAnalyticsCard
              keyofBuildingsState='annualEnergyDemand'
              link='/analytics/energy-demand'
              title='Energy Demand'
            />
          )}
          {showAnalytics('energy_consumption') && (
            <AnnualAnalyticsCard
              keyofBuildingsState='annualEnergyConsumption'
              link='/analytics/energy-consumption'
              title='Energy Consumption'
            />
          )}
          {showAnalytics('solar') && (
            <AnnualAnalyticsCard
              keyofBuildingsState='annualSolarGeneration'
              link='/analytics/solar-generation'
              title='Solar Generation'
            />
          )}
          {showAnalytics('export') && (
            <AnnualAnalyticsCard
              keyofBuildingsState='annualExport'
              link='/analytics/annual-export'
              title='Annual Export'
            />
          )}
        </Flex>

        <AssetAnalyticsContainer data-tn='assetAnalytics-container'>
          <Flex css={`margin-bottom: 28px;`} alignItems='center' justifyContent='space-between'>
            <Flex>
              <Title>Assets</Title>
              <LastBilling>Last Billing</LastBilling>
            </Flex>
            <a href={RoutePaths.assetsAnalytics} target='_blank' rel='noopener noreferrer'>
              <IconArrowRight
                color={colors.blue}
                css={`padding: 4px; margin: -4px; cursor: pointer;`}
              />
            </a>
          </Flex>
          <Flex>
            {assetNames.map(assetName => {
              const DeviceIcon = deviceToIconMap.hasOwnProperty(assetName as string) &&
                deviceToIconMap[assetName as string];
              return (
                <AssetContainer key={assetName}>
                  <span
                    data-tn={`assetCard-${assetName}-icon`}
                    style={{'display': 'flex', 'alignItems': 'center'}}
                  >
                    {DeviceIcon && <DeviceIcon />} <span style={{'marginLeft': '5px'}}>{assetName} </span>
                  </span>
                </AssetContainer>
              );
            })}
          </Flex>
        </AssetAnalyticsContainer>
      </div>
    </Layout>
  );
};

const AssetContainer = styled(Flex)`
  color: ${colors.blue} !important;
  svg path {
    fill: ${colors.blue};
  }
  user-select: none;
`;

const AssetAnalyticsContainer = styled.div`
  width: 100%;
  padding: 20.5px 30.5px;
  background-color: ${colors.white};
  border-radius: 2px;
  border: 1px solid ${colors.grayEEF3FA};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.1);
  margin-top: 49.5px;
`;

const LastBilling = styled.span`
  margin: 1px 0 0 20px;
  font-family: Aktiv Grotesk;
  font-weight: 500;
  font-size: 12px;
  color: ${colors.grayCBD4E2};
`;

const AnnualAnalyticsCardContainer = styled.div`
  width: 361px;
  height: 451px;
  border-radius: 2px;
  background-color: ${colors.white};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.1);
  margin-right: 46px;
`;

const Year = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.grayCBD4E2};
`;

const Quantity = styled.div<{ unit: string }>`
  margin-top: 6px;
  font-family: Aktiv Grotesk;
  font-size: 65px;
  font-weight: 500;
  color: ${colors.blue};

  :after {
    content: '${({ unit }) => unit}';
    font-size: 13px;
    bottom: 35px;
    position: relative;
    margin-left: 6px;
  }
`;
