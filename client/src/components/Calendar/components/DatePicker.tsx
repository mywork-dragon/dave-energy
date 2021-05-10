import React from 'react';
import styled from 'styled-components';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import { colors } from 'design-system';
import {
  dayDatePickerCssMixin,
  yearDatePickerCssMixin,
  DatePickerOnChange,
} from '.';

import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  closeDatePicker: () => void;
  onChange: DatePickerOnChange;
  showYearPicker?: boolean;
}

type Props = DatePickerProps & Partial<ReactDatePickerProps>;

export const DatePicker: React.FC<Props> = ({
  closeDatePicker,
  onChange,
  showYearPicker = false,
  ...props
}) => {
  const changePreviousNextText = () => {
    const previousButton = document.getElementsByClassName(
      'react-datepicker__navigation--previous',
    )?.[0];

    const nextButton = document.getElementsByClassName(
      'react-datepicker__navigation--next',
    )?.[0];

    if (previousButton) {
      previousButton.innerHTML = '←';
    }
    if (nextButton) {
      nextButton.innerHTML = '→';
    }
  };

  return (
    <DatePickerContainer
      data-tn='calendar-date-picker'
      css={showYearPicker ? yearDatePickerCssMixin : dayDatePickerCssMixin}
    >
      <ReactDatePicker
        {...props}
        autoFocus
        onChange={onChange}
        showYearPicker={showYearPicker}
        onClickOutside={closeDatePicker}
        onYearChange={changePreviousNextText}
        onMonthChange={changePreviousNextText}
        onCalendarOpen={changePreviousNextText}
      />
    </DatePickerContainer>
  );
};

const DatePickerContainer = styled.div`
  position: absolute;

  .react-datepicker-popper {
    transform: none !important;
    z-index: 3;
  }

  .react-datepicker {
    padding: 20px 25px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
    border: none;
    border-radius: unset;
  }

  .react-datepicker__navigation {
    all: unset;
    position: absolute;
    cursor: pointer;
    padding: 4px;
    color: ${colors.blue};
    font-family: Soleil;
    font-weight: 300;
    font-size: 13px;
    :hover {
      font-weight: 600;
    }
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__navigation--previous {
    z-index: 2;
  }

  .react-datepicker__navigation--next {
    z-index: 2;
  }

  input {
    opacity: 0;
  }
`;
