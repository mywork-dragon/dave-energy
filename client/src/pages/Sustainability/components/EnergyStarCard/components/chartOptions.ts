import { Options } from 'highcharts';
import { colors } from 'design-system';

const plotLines = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(value => ({
  color: colors.grayEEF3FA,
  value,
  width: 1.5,
}));

export const chartOptions: Options = {
  chart: {
    type: 'area',
    height: 181,
    backgroundColor: colors.white,
    spacing: [0, 0, 0, 0],
    margin: 0,
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  title: {
    text: undefined,
  },
  yAxis: {
    visible: false,
  },
  xAxis: {
    labels: {
      enabled: false,
    },
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
    plotLines,
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1,
        },
        stops: [
          [0, colors.grayEEF3FA],
          [1, colors.white],
        ],
      },
    },
  },
  tooltip: {
    valueDecimals: 0,
    valueSuffix: ' pts',
  },
};
