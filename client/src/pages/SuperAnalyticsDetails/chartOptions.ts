import { Options } from 'highcharts';

import { colors } from 'design-system';

export const chartOptions: Options = {
  chart: {
    animation: false,
    type: 'column',
    height: 376,
    spacing: [0, 0, 5, 0],
    marginLeft: 85,
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
  tooltip: {
    shared: true,
    valueDecimals: 0,
    valueSuffix: undefined,
  },
  plotOptions: {
    column: {
      borderWidth: 1,
      borderRadius: 1,
      groupPadding: 0.415,
      pointWidth: 4,
      visible: true,
    },
  },
  xAxis: {
    categories: [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ],
    crosshair: true,
    labels: {
      style: {
        fontFamily: 'Aktiv Grotesk',
        fontSize: '11px',
        fontWeight: '700',
        color: colors.gray575E68,
      },
    },
    lineColor: colors.grayEEF3FA,
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: colors.grayEEF3FA,
    labels: {
      style: {
        fontFamily: 'Aktiv Grotesk',
        fontSize: '11px',
        fontWeight: '700',
        color: colors.grayCBD4E2,
      },
      x: 3,
      y: -7,
    },
    title: {
      text: undefined,
    },
  },
};
