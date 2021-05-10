import React from 'react';
import styled from 'styled-components';

import { colors, Flex, Pill } from 'design-system';

type PillValue = 'Hours' | 'Days' | 'Weeks' | 'Billings' | 'Years';

interface Props {
  value: PillValue;
}

export const PillsSelector: React.FC<Props> = ({ value }) => {
  const valueToAdverbMap: Record<PillValue, string> = {
    Hours: 'hourly',
    Days: 'daily',
    Weeks: 'weekly',
    Billings: 'monthly',
    Years: 'yearly',
  };

  return (
    <SelectorContainer>
      <Title>Data Interval</Title>
      <Flex
        css={`
          & > span {
            &:not(:last-of-type) {
              margin-right: 15px;
            }
          }
        `}
      >
        <Pill isActive={value === 'Hours'}>Hours</Pill>
        <Pill isActive={value === 'Days'}>Days</Pill>
        <Pill isActive={value === 'Weeks'}>Weeks</Pill>
        <Pill isActive={value === 'Billings'}>Billings</Pill>
        <Pill isActive={value === 'Years'}>Years</Pill>
      </Flex>
      <Message>
        Your charts are showing {valueToAdverbMap[value]} data points.
      </Message>
    </SelectorContainer>
  );
};

const Title = styled.h3`
  font-family: Soleil;
  font-size: 13px;
  line-height: 22px;
  color: ${colors.blue};
  margin-bottom: 17px;
`;

const Message = styled.p`
  font-family: Soleil;
  font-size: 12px;
  line-height: 22px;
  color: ${colors.grayCBD4E2};
  margin-top: 6px;
`;

const SelectorContainer = styled.div`
  min-width: 280px;
`;
