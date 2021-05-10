import moment from 'moment';

import { colors } from 'design-system';


export const formatDatetime = (date: Date): string => (
  moment(date.toJSON()).set({
    hour: 0,
    minute: 0,
    seconds: 0,
    millisecond: 0,
  }).toISOString().replace('Z', '')
);


export const getPtcColor = (ptc: string): string => {
  const percentValue = parseFloat(ptc);
  if (isNaN(percentValue)) {
    return colors.blue;
  }
  return percentValue < 0
    ? colors.green
    : percentValue > 0
    ? colors.error
    : colors.blue;
};


export const parseTime = (date: Date): [number, string, string] => {
  const hours = date.getHours();
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');

  const AMorPM = hours < 12 ? 'AM' : 'PM';
  const hourDisplay = hours === 0 || hours === 12 ? 12 : hours % 12;
  return [hourDisplay, minutes, AMorPM];
};


// Find the index in the 96-15 minute tick array for which the Date lands on
export const getHourMinuteTickIndex = (date: Date): number => {
  const hour = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const minute = date
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const hourMinuteString = `${hour}${minute}`;

  if (hourMinuteString < '0015') {
    return 0;
  } else if (hourMinuteString >= '2345') {
    return 95;
  } else {
    const index = hourMinuteTicks.findIndex(tick => `${hour}${minute}` <= tick);
    // If it is between a tick, we want the tick before, not after
    if (
      (minute > '00' && minute < '15') ||
      (minute > '15' && minute < '30') ||
      (minute > '30' && minute < '45') ||
      (minute > '45' && minute < '59')
    ) {
      return index - 1;
    } else {
      return index;
    }
  }
};


export const monthIndexMap: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};


export const hourMinuteTicks: string[] = [
  '0000',
  '0015',
  '0030',
  '0045',
  '0100',
  '0115',
  '0130',
  '0145',
  '0200',
  '0215',
  '0230',
  '0245',
  '0300',
  '0315',
  '0330',
  '0345',
  '0400',
  '0415',
  '0430',
  '0445',
  '0500',
  '0515',
  '0530',
  '0545',
  '0600',
  '0615',
  '0630',
  '0645',
  '0700',
  '0715',
  '0730',
  '0745',
  '0800',
  '0815',
  '0830',
  '0845',
  '0900',
  '0915',
  '0930',
  '0945',
  '1000',
  '1015',
  '1030',
  '1045',
  '1100',
  '1115',
  '1130',
  '1145',
  '1200',
  '1215',
  '1230',
  '1245',
  '1300',
  '1315',
  '1330',
  '1345',
  '1400',
  '1415',
  '1430',
  '1445',
  '1500',
  '1515',
  '1530',
  '1545',
  '1600',
  '1615',
  '1630',
  '1645',
  '1700',
  '1715',
  '1730',
  '1745',
  '1800',
  '1815',
  '1830',
  '1845',
  '1900',
  '1915',
  '1930',
  '1945',
  '2000',
  '2015',
  '2030',
  '2045',
  '2100',
  '2115',
  '2130',
  '2145',
  '2200',
  '2215',
  '2230',
  '2245',
  '2300',
  '2315',
  '2330',
  '2345',
];
