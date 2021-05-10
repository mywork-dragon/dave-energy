import Highcharts from 'highcharts';
import { SuperAnalyticsChartModel } from 'models';
import { chartOptions } from '../chartOptions';

export const getChartOptions = (
  superAnalyticsChart: SuperAnalyticsChartModel,
): Highcharts.Options => {
  const lastYearSeries = superAnalyticsChart.generateLastYearSeriesBarOptions();
  const currentYearSeries = superAnalyticsChart.generateCurrentYearSeriesBarOptions();
  const valueSuffix =
    ` ${superAnalyticsChart.electricity?.currentYear?.unit}` ??
    ` ${superAnalyticsChart.electricity?.lastYear?.unit}`;
  const formatter = function(
    this: Highcharts.AxisLabelsFormatterContextObject<number>,
  ) {
    return `${Highcharts.numberFormat(this.value, 0, '', ',')} ${
      superAnalyticsChart.electricity?.currentYear?.unit
    }`;
  };

  return {
    ...chartOptions,
    tooltip: {
      ...chartOptions.tooltip,
      valueSuffix,
    },
    yAxis: {
      ...chartOptions.yAxis,
      labels: {
        ...(chartOptions.yAxis as Highcharts.YAxisOptions)?.labels,
        formatter,
      },
    },

    series: [lastYearSeries, currentYearSeries],
  };
};
