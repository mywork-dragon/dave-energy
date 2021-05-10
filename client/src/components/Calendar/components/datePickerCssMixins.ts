import { css } from 'styled-components';
import { colors } from 'design-system';

export const dayDatePickerCssMixin = css`
  .react-datepicker__header {
    background-color: ${colors.white};
    border-bottom: 1px solid ${colors.grayEEF3FA};
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__current-month {
    font-family: Soleil;
    font-weight: 600;
    text-transform: uppercase;
    color: ${colors.blue};
    font-size: 25px;
    margin-bottom: 27px;
  }

  .react-datepicker__navigation--previous {
    left: 55px;
    top: 33px;
  }

  .react-datepicker__navigation--next {
    right: 55px;
    top: 33px;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
    margin: 9px 0;

    :last-of-type {
      margin-bottom: 0;
    }
  }

  .react-datepicker__day-names {
    margin-bottom: 12px;
  }

  .react-datepicker__day-name {
    font-family: Soleil;
    font-weight: 300;
    font-size: 13px;
    color: ${colors.blue};
    width: 48px;
    margin: 0;
  }

  .react-datepicker__day {
    line-height: 44px;
    width: 40px;
    height: 40px;
    font-family: Aktiv Grotesk;
    font-weight: 500;
    font-size: 15px;
    color: ${colors.blue};
    margin: 0;
    border-radius: 99px;
    outline: none;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: ${colors.blue};
    color: ${colors.white};
  }

  .react-datepicker__day--outside-month {
    color: ${colors.grayCBD4E2};
  }

  .react-datepicker__day--selected {
    background-color: ${colors.blue};
    color: ${colors.white};
  }

  .react-datepicker__day--today {
    color: ${colors.white};
    background-color: ${colors.green};
  }
`;

export const yearDatePickerCssMixin = css`
  .react-datepicker {
    height: max-content;
    width: 375px;
  }

  .react-datepicker__year-wrapper {
    max-width: unset;
    justify-content: space-between;
  }

  .react-datepicker-year-header {
    background: ${colors.white};
    color: ${colors.white};
    padding-bottom: 15px;
    border-bottom: 1px solid ${colors.grayEEF3FA};
  }

  .react-datepicker__navigation--previous {
    top: 25px;
  }

  .react-datepicker__navigation--next {
    right: 30px;
    top: 25px;
  }

  .react-datepicker__year-container {
    margin: 16px 0 0 0;
  }

  .react-datepicker__year-text {
    font-family: Soleil;
    font-size: 18px;
    font-weight: 700;
    padding: 7px 0;
    margin: 10px 0;
    width: 5.6rem;
    color: ${colors.blue};
    :hover {
      border-radius: 20px;
    }
  }

  .react-datepicker__year-text--disabled {
    color: #cccccc;
  }

  .react-datepicker__year-text--keyboard-selected {
    background-color: unset;
    :hover {
      background-color: #f0f0f0;
    }
  }

  .react-datepicker__year-text--today {
    color: ${colors.white};
    background-color: ${colors.green} !important;
    border-radius: 20px;
  }
`;
