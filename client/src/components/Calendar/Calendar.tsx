import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ReactDatePickerProps } from 'react-datepicker';

import { DatePicker, DatePickerOnChange } from './components';
import { colors, Flex, IconCalendar, IconDropdownArrow } from 'design-system';
import { RootState } from 'store';
import { setTime } from 'store/time';
import { monthIndexMap } from 'utils';

type DateDisplayFormat = 'day' | 'dayAndYear' | 'year';

interface CalendarProps {
  className?: string;
  dateDisplayFormat: DateDisplayFormat;
  isUppercase?: boolean;
  onChange?: (date: Date) => void;
  showYearPicker?: boolean;
}

type Props = CalendarProps & Partial<ReactDatePickerProps>;

const formatDate = (
  date: Date,
  dateDisplayFormat: DateDisplayFormat,
  isUppercase: boolean,
): string => {
  const monthIndex = date.getMonth();
  const calendarDate = date.getDate();
  const year = date.getFullYear();

  let formattedDate = '';
  switch (dateDisplayFormat) {
    case 'day':
      formattedDate = `${monthIndexMap[monthIndex]} ${calendarDate}`;
      break;
    case 'year':
      formattedDate = year.toString();
      break;
    case 'dayAndYear':
    default:
      formattedDate = `${monthIndexMap[monthIndex]} ${calendarDate}, ${year}`;
  }
  return isUppercase ? formattedDate.toUpperCase() : formattedDate;
};

export const Calendar: React.FC<Props> = ({
  className = '',
  dateDisplayFormat,
  isUppercase = false,
  onChange = () => {},
  showYearPicker = false,
  ...props
}) => {
  const dispatch = useDispatch();
  const date = useSelector((state: RootState) => state.time.instance);
  const [isDatePickerShown, setIsDatePickerShown] = useState(false);

  const handleDatePickerOnChange: DatePickerOnChange = (selectedDate): void => {
    if (!selectedDate) {
      return;
    }
    // The selected date will default to 12:00AM. Preserve the minute and hour
    // by only changing the month, year, and day
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const newDate = selectedDate.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    dispatch(setTime(new Date(year, month, newDate, hour, minute)));
    setIsDatePickerShown(false);
  };

  return (
    <div className={className} style={{ 'width': 'max-content' }}>
      <Flex alignItems='center'>
        <div
          style={{
            'fontFamily': 'Aktiv Grotesk',
            'fontWeight': 500,
            'fontSize': '45px',
            'color': colors.blue,
            'marginRight': '6px',
          }}
          data-tn='calendar-display'
        >
          {formatDate(date, dateDisplayFormat, isUppercase)}
        </div>
        <IconCarotFlex
          alignItems='center'
          flexDirection='column'
          data-tn='calendar-toggle-date-picker'
          onClick={() => setIsDatePickerShown(!isDatePickerShown)}
        >
          <IconCalendar color={colors.blue} />
          <IconDropdownArrow color={colors.blue} />
        </IconCarotFlex>
      </Flex>
      {isDatePickerShown && (
        <DatePicker
          {...props}
          selected={date}
          showYearPicker={showYearPicker}
          maxDate={new Date()}
          minDate={new Date('01-01-2020')}
          onChange={handleDatePickerOnChange}
          closeDatePicker={() => setIsDatePickerShown(false)}
        />
      )}
    </div>
  );
};

const IconCarotFlex = styled(Flex)`
  cursor: pointer;
  :active {
    transform: scale(0.98);
  }
`;
