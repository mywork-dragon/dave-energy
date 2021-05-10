import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { GreenhouseGasEmissionModel } from 'models';
import { colors, Title, IconGas, UtilityButton } from 'design-system';
import { chartOptions } from './components';

interface GreenhouseGasEmissionsProps {
  emissions: GreenhouseGasEmissionModel[] | null;
}

// TODO: Find out how to include this inside of the component instead of
// referencing it outside. The useEffect clause does not refer
// to the updated chart in the callback function.
let chart: Chart;

export const Emissions: React.FC<GreenhouseGasEmissionsProps> = ({
  emissions,
}) => {
  if (!emissions || !emissions?.length) {
    return null;
  }

  useEffect(() => {
    chart?.get('Electricity')?.remove();
    chart?.addSeries?.(
      GreenhouseGasEmissionModel.generateSeriesLineOptions(emissions),
    );
  }, [emissions]);

  return (
    <EmissionsContainer>
      <Title size="large">Emissions</Title>
      <EmissionsHeader>
        <UtilityButton Icon={IconGas} isActive text="Greenhouse Gas" />
      </EmissionsHeader>
      <HighchartsReact
        options={chartOptions}
        callback={(chartInstance: Chart) => (chart = chartInstance)}
      />
    </EmissionsContainer>
  );
};

const EmissionsContainer = styled.div``;

const EmissionsHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid ${colors.grayEEF3FA};
`;
