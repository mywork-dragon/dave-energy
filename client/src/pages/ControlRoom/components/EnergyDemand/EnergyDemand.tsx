import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Highcharts, { Chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

import { Utility } from 'types';
import {
  AMPMLines,
  chartOptions,
  GraphTicks,
  LegendButtons,
  UtilityButtons,
} from './components';
import { SetDeviceVisibilityType } from './components/LegendButtons';
import { colors, Flex, Slider, Title, Toggle } from 'design-system';
import {
  EnergyDemandModel,
  PositiveNegativeSeriesOptions,
  DeviceName,
} from 'models';
import { RootState } from 'store';

interface Props {
  demand: EnergyDemandModel | null;
}

export const EnergyDemand = ({ demand }: Props) => {
  const [positiveChart, setPositiveChart] = useState<Chart | undefined>();
  const [negativeChart, setNegativeChart] = useState<Chart | undefined>();
  const [activeUtility, setActiveUtility] = useState<Utility | undefined>();
  const [isTargetToggled, setIsTargetToggled] = useState<boolean>(false);
  const [deviceToVisibleMap, setDeviceToVisibleMap] = useState<Record<DeviceName, boolean>>({
    Meter: true,
    HVAC: false,
    Lighting: false,
    Other: false,
    Battery: false,
    Generator: false,
    Solar: false,
  });

  const energyDemandLoading = useSelector(({ buildings }: RootState) => buildings.energyDemandLoading);

  useEffect(() => {
    if (energyDemandLoading) {
      positiveChart?.showLoading();
    } else {
      positiveChart?.hideLoading();
    }
  }, [energyDemandLoading]);

  useEffect(() => {
    if (!activeUtility) {
      const utilities = ['electricity', 'gas', 'steam'] as Utility[];
      const activeUtility = utilities.find(utility => demand?.getDemandByUtilityType(utility) ?? null);
      setActiveUtility(activeUtility);
    }
    normalizeChartExtremes();
  }, [activeUtility]);

  useEffect(() => {
    // If the component receives an EnergyDemandModel, we need to initialize
    // the active utility button based on the payload and according to the first
    // available utility in the array as per design
    const utilities = ['electricity', 'gas', 'steam'] as Utility[];
    const activeUtility = utilities.find(utility => demand?.getDemandByUtilityType(utility) ?? null);
    setActiveUtility(activeUtility);
    normalizeChartExtremes();
  }, [demand]);

  const getSeriesOptions = (): PositiveNegativeSeriesOptions => {
    if (!activeUtility || !demand) {
      return {
        positive: [],
        negative: [],
      };
    }
    return demand.generateSeriesOptionsForEnergyType(activeUtility, deviceToVisibleMap);
  };

  const updateDeviceToVisibleMap: SetDeviceVisibilityType = (deviceName, toVisibility) => {
    // make a copy to prevent side effects
    const deviceToVisibleMapCopy = { ...deviceToVisibleMap };
    const availableDevicesWithoutMeter = demand.getDeviceNamesByEnergyType(activeUtility!);
    const meterIndex = availableDevicesWithoutMeter!.findIndex(deviceName => deviceName === 'Meter');
    availableDevicesWithoutMeter?.splice(meterIndex, 1);

    if (deviceName === 'Meter' && toVisibility) {
      // Turning Meter visible turns all other devices/assets off
      availableDevicesWithoutMeter?.forEach(deviceName => (deviceToVisibleMapCopy[deviceName] = false));
      deviceToVisibleMapCopy['Meter'] = true;
    } else if (deviceName === 'Meter' && !toVisibility) {
      // Turning Meter invisible turns all other devices/assets on
      availableDevicesWithoutMeter?.forEach(deviceName => (deviceToVisibleMapCopy[deviceName] = true));
      deviceToVisibleMapCopy['Meter'] = false;
    } else if (deviceName !== 'Meter') {
      // If its non-Meter, we toggle visibility to the desired state. Check if
      // all devices/assets are invisible, if so Meter is visible. If not, Meter
      // is invisible
      deviceToVisibleMapCopy[deviceName] = toVisibility;

      const areAllAvailableDevicesHidden = availableDevicesWithoutMeter.findIndex(
        deviceName => deviceToVisibleMapCopy[deviceName] === true
      ) === -1;

      if (areAllAvailableDevicesHidden) {
        deviceToVisibleMapCopy['Meter'] = true;
      } else {
        deviceToVisibleMapCopy['Meter'] = false;
      }
    }

    setDeviceToVisibleMap(deviceToVisibleMapCopy);
    normalizeChartExtremes();
  };

  const normalizeChartExtremes = () => {
    // Wrap in a timeout to sync with event queue
    setTimeout(() => {
      const positiveExtremes = positiveChart?.yAxis?.[0].getExtremes();
      const negativeExtremes = negativeChart?.yAxis?.[0].getExtremes();
      if (positiveExtremes && negativeExtremes) {
        const { dataMin: positiveMin, dataMax: positiveMax } = positiveExtremes;
        const { dataMin: negativeMin, dataMax: negativeMax } = negativeExtremes;
        const absoluteHighest = [positiveMin, positiveMax, negativeMin, negativeMax].reduce(
          (highest, number) => Math.abs(number) > highest ? Math.abs(number) : highest, 0
        );
        positiveChart?.yAxis[0].setExtremes(0, absoluteHighest);
        negativeChart?.yAxis[0].setExtremes(-absoluteHighest, 0);
      }
    }, 0);
  };

  const { positive, negative } = getSeriesOptions();

  if (isTargetToggled) {
    positive.push(demand.generateTargetLineSeriesOptions());
  }

  return (
    <div style={{paddingBottom: '120px', overflow: 'hidden'}}>
      <div style={{margin: '0 50px'}}>
        <Title size='large'>Energy Demand</Title>
        <EnergyDemandButtonsFlex alignItems='flex-end' justifyContent='space-between'>
          <UtilityButtons
            demand={demand}
            activeUtility={activeUtility}
            onClick={selectedUtility => setActiveUtility(selectedUtility)}
          />
          <Flex alignItems='center'>
            <WrappedToggle
              label='Target'
              isToggled={isTargetToggled}
              onClick={() => setIsTargetToggled(isTargetToggled => !isTargetToggled)}
            />
            <LegendButtons
              deviceToVisibleMap={deviceToVisibleMap}
              setDeviceVisibility={updateDeviceToVisibleMap}
              devices={demand?.[activeUtility as Utility] ?? null}
            />
          </Flex>
        </EnergyDemandButtonsFlex>
      </div>
      <div style={{position: 'relative', paddingTop: '78px'}}>
        <AMPMLines />
        <Slider />
        <HighChartsWrapper>
          <HighchartsReact
            highcharts={Highcharts}
            options={{ ...chartOptions, series: positive }}
            callback={(chart: Chart) => setPositiveChart(chart)}
          />
        </HighChartsWrapper>
        <GraphTicks />
        <HighChartsWrapper>
          <HighchartsReact
            highcharts={Highcharts}
            options={{ ...chartOptions, series: negative }}
            callback={(chart: Chart) => setNegativeChart(chart)}
          />
        </HighChartsWrapper>
      </div>
    </div>
  );
}

const HighChartsWrapper = styled.div`
  position: relative;
  width: calc(100% - 44px * 2);
  margin: 0 44px;
  border-top: 1px solid ${colors.grayEEF3FA};
  border-bottom: 1px solid ${colors.grayEEF3FA};
`;

const EnergyDemandButtonsFlex = styled(Flex)`
  position: relative;
  border-bottom: 1px solid ${colors.grayEEF3FA};
  height: 83px;
  width: inherit;
`;

const WrappedToggle = styled(Toggle)`
  margin-right: 50px;
  bottom: 5px;
`;
