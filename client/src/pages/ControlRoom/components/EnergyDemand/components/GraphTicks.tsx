import React from 'react';
import styled from 'styled-components';

import { colors, Flex } from 'design-system';

export const GraphTicks = () => {
  const ticks: React.ReactElement[] = [];
  const hours = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
  ];
  hours.forEach((hour, index) => {
    ticks.push(<HourTick key={index}>{hour}</HourTick>);
    ticks.push(<MinuteTick key={`${index}-15`}>15&apos;</MinuteTick>);
    ticks.push(<MinuteTick key={`${index}-30`}>30&apos;</MinuteTick>);
    ticks.push(<MinuteTick key={`${index}-45`}>45&apos;</MinuteTick>);
  });
  return (
    <GraphTicksContainer alignItems="center" justifyContent="space-between">
      {ticks}
    </GraphTicksContainer>
  );
};

const GraphTicksContainer = styled(Flex)`
  background-color: ${colors.white};
  height: 26px;
  padding: 0 46px;
  margin-top: 1px;
`;

const HourTick = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 11px;
  font-weight: 700;
  color: ${colors.gray575E68};
  width: 11px;
  text-align: center;
`;

const MinuteTick = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 9px;
  font-weight: 500;
  color: ${colors.grayBCC1C9};
  width: 11px;
  text-align: center;
`;
