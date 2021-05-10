import { Options } from 'highcharts';
import { colors } from 'design-system';

export const chartOptions: Options = {
  chart: {
    height: 360,
    spacing: [40, 0, 0, 0],
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false,
      },
    },
  },
  title: {
    text: undefined,
  },
  tooltip: {
    valueSuffix: ' tCO2e',
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
        color: '#575e68',
      },
    },
    lineColor: colors.grayEEF3FA,
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: colors.grayEEF3FA,
    labels: {
      align: 'left',
      format: '{value} tCO2e',
      style: {
        fontFamily: 'Aktiv Grotesk',
        fontSize: '11px',
        fontWeight: '700',
        color: '#cbd4e2',
      },
      x: 3,
      y: -7,
    },
    title: {
      text: undefined,
    },
    visible: true,
  },
};
