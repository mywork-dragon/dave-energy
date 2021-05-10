import { Options } from 'highcharts';

import { colors } from 'design-system';

export default function chartOptions(unit: string): Options {
  return {
    chart: {
      type: 'column',
      height: 208,
      backgroundColor: colors.white,
      marginRight: 14,
      marginLeft: 13,
      marginBottom: 0,
    },
    credits: { enabled: false },
    legend: { enabled: false },
    title: { text: undefined },
    yAxis: {
      labels: {
        format: `{value} ${unit}`,
      },
      visible: false
    },
    xAxis: {
      labels: { enabled: false },
      categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      lineColor: colors.white,
      plotLines: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(value => ({
        color: colors.grayEEF3FA,
        value,
        width: 1.5,
      })),
    },
    plotOptions: {
      bar: { stacking: 'normal' },
    },
    tooltip: { valueDecimals: 0, valueSuffix: ` ${unit}` },
  };
};
