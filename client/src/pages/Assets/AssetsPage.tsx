import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import Highcharts, { Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Select } from 'semantic-ui-react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import {
  getBuildingAssetChartValues,
  getBuildingAssetDropdownOptions,
} from 'store/buildings';
import { RootState } from 'store';
import { Calendar, ChartLoading, SectionSelector, Layout } from 'components';
import {
  colors,
  Flex,
  IconDropdownArrow,
  LegendButton,
} from 'design-system';
import chartDefaults from './chartOptions';


enum EngineerAnalyticsTitle {
  assets = 'Assets',
  energyDemand = 'Energy Demand',
  energyConsumption = 'Energy Consumption',
  solarGeneration = 'Solar Generation',
}

interface StoreStateProps {
  date: Date;
  assets: any | null;
  assetChartValues: any | null;
  assetChartUnitMeasureOf?: string | null;
  assetChartUnitSymbol?: string | null;
  assetDeviceMap: any | null;
  devicePointMap: any | null;
  activeBuildingId: number | null;
}

interface StoreDispatchProps {
  getBuildingAssetChartValues: typeof getBuildingAssetChartValues;
}

type Props = StoreDispatchProps & StoreStateProps & RouteComponentProps;

const AssetsPageComponent = ({
  assets,
  assetChartValues,
  assetChartUnitMeasureOf,
  assetChartUnitSymbol,
  assetDeviceMap,
  date,
  devicePointMap,
  getBuildingAssetChartValues,
}: Props) => {
  const dispatch = useDispatch();
  const [activeAsset, setActiveAsset] = useState<any>({});
  const [activeDevice, setActiveDevice] = useState<any>({});
  const [activePoint, setActivePoint] = useState<any>({});
  const [chart, setChart] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>(chartDefaults);

  const activeBuildingId = useSelector(({ buildings }: RootState) => buildings.activeBuilding?.id);
  const isAssetChartLoading = useSelector(({ buildings }: RootState) => buildings.assetChartLoading);

  // on assets change, set initial asset, device, and point
  useEffect(() => {
    if (assets && assets?.length) {
      const initialAsset = assets[0];
      const initialDevice = assetDeviceMap[initialAsset.value][0];
      const initialPoint = devicePointMap[initialDevice.value][0];
      setActiveAsset(initialAsset);
      setActiveDevice(initialDevice);
      setActivePoint(initialPoint);
    }
  }, [assets]);

  useEffect(() => {
    if (chart) {
      if (isAssetChartLoading) {
        chart.showLoading();
      } else {
        chart.hideLoading();
      }
    }
  }, [isAssetChartLoading]);

  // on building id change, fetch asset dropdown options
  useEffect(() => {
    if (activeBuildingId) {
      dispatch(getBuildingAssetDropdownOptions(activeBuildingId));
    }
  }, [activeBuildingId]);

  // on chart data change, update chartOptions
  useEffect(() => {
    const unitSymbol = assetChartUnitSymbol || 'kW';
    const unitMeasureOf = assetChartUnitMeasureOf || '—';
    setChartOptions((prevOptions: Options) => ({
      ...prevOptions,
      series: [{
        data: assetChartValues.map(o => o.quantity),
        type: 'column',
        name: unitMeasureOf,
        id: unitMeasureOf,
        visible: true,
      }],
      tooltip: {
        ...prevOptions.tooltip,
        valueSuffix: unitSymbol,
      },
      xAxis: {
        ...prevOptions.xAxis,
        categories: assetChartValues.map(o => o.ts),
      },
      yAxis: {
        ...prevOptions.yAxis,
        labels: {
          ...prevOptions.yAxis.labels,
          format: `{value} ${unitSymbol}`,
        }
      }
    }));
  }, [assetChartValues]);

  // on active point or date change, clear chart if point is unset otherwise fetch chart data
  useEffect(() => {
    if (isEmpty(activePoint)) {
      clearChart();
    } else {
      getBuildingAssetChartValues(activeBuildingId!, activePoint.value, date);
    }
  }, [activePoint, date]);

  const onSelect = (type: string) => (_, { value: id }: any) => {
    switch (type) {
      case 'asset':
        const asset = assets.find(a => a.value === id);
        setActiveAsset(asset);
        setActiveDevice({});
        setActivePoint({});
        return;
        case 'device':
          const device = assetDeviceMap[activeAsset.value].find(d => d.value === id);
          setActiveDevice(device);
          setActivePoint({});
        return;
      case 'point':
        const point = devicePointMap[activeDevice.value].find(p => p.value === id);
        clearChart();
        setActivePoint(point);
        return;
    }
  };

  const clearChart = () => {
    if (chart?.series?.length) {
      chart.series.forEach(series => series.remove(true));
    }
  }

  return (
    <Layout isHeaderSticky>
      <AnalyticsHeaderContainer justifyContent='space-between'>
        <Calendar useWeekdaysShort dateDisplayFormat='day' />
      </AnalyticsHeaderContainer>

      <AssetsPageContainer>
        <SectionSelector sectionTitle={EngineerAnalyticsTitle.assets} />
        {activeAsset?.value ? (
          <span>
            <ChartHeader alignItems='center' justifyContent='space-between'>
              <span className='assets-page-dropdown-wrapper'>
                <Select
                  search
                  options={assets}
                  value={activeAsset.value}
                  placeholder='Select Asset'
                  style={{maxWidth: '200px'}}
                  onChange={onSelect('asset')}
                  className='assets-page-dropdown'
                  icon={<IconDropdownArrow className='assets-page-dropdown-icon' />}
                />
                <Select
                  search
                  placeholder='Select Device'
                  value={activeDevice.value}
                  style={{maxWidth: '200px'}}
                  onChange={onSelect('device')}
                  className='assets-page-dropdown'
                  options={assetDeviceMap[activeAsset.value]}
                  icon={<IconDropdownArrow className='assets-page-dropdown-icon' />}
                />
                <Select
                  search
                  placeholder='Select Point'
                  value={activePoint?.value}
                  style={{maxWidth: '300px'}}
                  onChange={onSelect('point')}
                  className='assets-page-dropdown'
                  options={devicePointMap[activeDevice.value]}
                  icon={<IconDropdownArrow className='assets-page-dropdown-icon' />}
                />
              </span>
              {activePoint?.text && (
                <LegendButton isActive activeColor={colors.blue}>
                  {activePoint.text.toUpperCase()}
                </LegendButton>
              )}
            </ChartHeader>
            <HighchartsReact
              options={chartOptions}
              highcharts={Highcharts}
              callback={(chart: any) => setChart(chart)}
            />
          </span>
        ) : (
          <ChartLoading />
        )}
      </AssetsPageContainer>
    </Layout>
  );
};

const AssetsPageContainer = styled.div`
  margin: 43px 50px;
`;

const ChartHeader = styled(Flex)`
  border-bottom: 1px solid ${colors.grayEEF3FA};
  margin-top: 15px;
`;

const AnalyticsHeaderContainer = styled(Flex)`
  position: sticky;
  height: 129px;
  top: 80px;
  box-shadow: 0 30px 30px -30px rgba(87, 94, 104, 0.1);
  background-color: ${colors.white};
  z-index: 3;
  padding: 18px 46px;
`;

function mapStateToProps(state: RootState): StoreStateProps {
  return {
    assets: state.buildings?.dropdownOptions?.assets ?? null,
    assetChartValues: state.buildings?.assetChartValues ?? [],
    assetChartUnitMeasureOf: state.buildings?.assetChartUnitMeasureOf ?? null,
    assetChartUnitSymbol: state.buildings?.assetChartUnitSymbol ?? null,
    assetDeviceMap: state.buildings?.dropdownOptions?.assetDeviceMap ?? null,
    devicePointMap: state.buildings?.dropdownOptions?.devicePointMap ?? null,
    activeBuildingId: state.buildings?.activeBuilding?.id ?? null,
    date: state.time?.instance,
  };
}

function mapDispatchToProps(dispatch: any): StoreDispatchProps {
  return {
    getBuildingAssetChartValues(buildingId, pointId, fromTime) {
      return dispatch(getBuildingAssetChartValues(buildingId, pointId, fromTime))
    },
  };
}

export const AssetsPage = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AssetsPageComponent),
);
