import { Options } from 'highcharts';

import { colors } from 'design-system';


export default {
  chart: {
    animation: false,
    type: 'column',
    height: 376,
    spacing: [0, 0, 5, 0],
  },
  credits: { enabled: false },
  legend: { enabled: false },
  title: { text: undefined },
  tooltip: {
    shared: true,
    valueDecimals: 0,
    valueSuffix: ' kW',
  },
  plotOptions: {
    column: {
      borderColor: colors.blue,
      borderWidth: 1,
      borderRadius: 1,
      pointWidth: 4,
      color: colors.blue,
      visible: true,
    },
  },
  xAxis: {
    categories: [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
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
    offset: 40,
    gridLineWidth: 1,
    gridLineColor: colors.grayEEF3FA,
    labels: {
      align: 'left',
      format: '{value} kW',
      style: {
        fontFamily: 'Aktiv Grotesk',
        fontSize: '11px',
        fontWeight: '700',
        color: colors.grayCBD4E2,
      },
      x: 3,
      y: -7,
    },
    title: { text: undefined },
  },
} as Options;
