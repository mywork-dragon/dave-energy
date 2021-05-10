import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { colors, Flex } from 'design-system';
import { RootState } from 'store';
import { setTime } from 'store/time';

export const DayIncrementer = () => {
  const dispatch = useDispatch();
  const date = useSelector((state: RootState) => state.time.instance);

  const handleYesterdayClick = (): void => {
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    dispatch(setTime(yesterday));
  };

  const handleTodayClick = (): void => {
    const today = new Date();
    dispatch(setTime(today));
  };

  const handleTomorrowClick = (): void => {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    dispatch(setTime(tomorrow));
  };

  return (
    <Flex>
      <Yesterday
        data-tn="dayIncrementer-yesterday"
        onClick={handleYesterdayClick}
      >
        Yesterday
      </Yesterday>
      <Today data-tn="dayIncrementer-today" onClick={handleTodayClick}>
        Today
      </Today>
      <Tomorrow data-tn="dayIncrementer-tomorrow" onClick={handleTomorrowClick}>
        Tomorrow
      </Tomorrow>
    </Flex>
  );
};

const dateIncrementerMixin = css`
  font-family: Soleil;
  font-weight: 350;
  font-size: 13px;
  cursor: pointer;

  :hover {
    color: ${colors.blue};
    padding-bottom: 3px;
    border-bottom: 1px solid ${colors.blue};
    margin-bottom: -4px;
  }

  :active {
    transform: scale(0.98);
  }
`;

const Yesterday = styled.a`
  ${dateIncrementerMixin};
  color: ${colors.grayCBD4E2};
  margin-right: 10px;

  :before {
    content: '←';
    margin-right: 4px;
    font-size: 10px;
  }
`;

const Today = styled.span`
  ${dateIncrementerMixin};
  color: ${colors.blue};
  margin-right: 10px;
`;

const Tomorrow = styled.a`
  ${dateIncrementerMixin};
  color: ${colors.grayCBD4E2};

  :after {
    content: '→';
    margin-left: 4px;
    font-size: 10px;
  }
`;
