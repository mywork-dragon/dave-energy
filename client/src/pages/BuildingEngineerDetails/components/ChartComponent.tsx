import React, { useState, useEffect } from 'react';
import { Chart, Options } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { generateChartOptions } from '.';
import {
  BuildingEngineerAnalyticsChartModel,
  EnergyConsumptionYearComparisonModel,
} from 'models';

interface Props {
  model:
    | BuildingEngineerAnalyticsChartModel
    | EnergyConsumptionYearComparisonModel
    | null
    | undefined;
}

export const ChartComponent: React.FC<Props> = ({ model }) => {
  const [chart, setChart] = useState<Chart>();
  const [chartOptions, setChartOptions] = useState<Options>(generateChartOptions('kW'));

  useEffect(() => {
    chart?.get(BuildingEngineerAnalyticsChartModel.year1SeriesId)?.remove();
    chart?.get(BuildingEngineerAnalyticsChartModel.year2SeriesId)?.remove();

    if (model) {
      chart?.hideLoading();
      chart?.addSeries?.(model.generateYear2SeriesBarOptions());
      chart?.addSeries?.(model.generateYear1SeriesBarOptions());
      setChartOptions(generateChartOptions(model.unit));
    } else {
      chart?.showLoading();
    }
  }, [model, chart]);

  return (
    <HighchartsReact
      options={chartOptions}
      callback={(chartInstance: Chart) => setChart(chartInstance)}
    />
  );
};
