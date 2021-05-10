import React, { useState } from 'react';
import styled from 'styled-components';
import { isNull } from 'lodash';

import { colors, Flex, Title } from 'design-system';
import { BillingInformationModel } from 'models';

type DayOrTotal = 'day' | 'total';
const isChrome = /chrome/.test(navigator.userAgent.toLowerCase());

interface BillingTotalProps {
  billingInformation: BillingInformationModel | null;
}

export const BillingTotal: React.FC<BillingTotalProps> = ({
  billingInformation,
}) => {
  if (!billingInformation) {
    return null;
  }

  const [dayOrTotal, setDayOrTotal] = useState<DayOrTotal>('total');
  const isSolar = !isNull(billingInformation.billingCycleSolarTotal);
  let total = isSolar ? billingInformation.billingCycleSolarTotal : billingInformation.billingTotal;
  let dayTotal = isSolar ? billingInformation.todaySolarTotal : billingInformation.billingDayTotal;

  return (
    <BillingTotalFlex flexDirection='column'>
      <Flex>
        <WrappedTitle isActive={dayOrTotal === 'day'} onClick={() => setDayOrTotal('day')}>
          {isSolar ? 'Solar Day Total' : 'Day Total'}
        </WrappedTitle>
        <WrappedTitle isActive={dayOrTotal === 'total'} onClick={() => setDayOrTotal('total')}>
          {isSolar ? 'Solar Total' : 'Billing Total'}
        </WrappedTitle>
      </Flex>
      <Flex css='margin-top: 12px;'>
        <BillingTotalText style={{ marginRight: '14px' }}>
          {dayOrTotal === 'day'
            ? dayTotal?.toLocaleString('en')
            : total?.toLocaleString('en')}
        </BillingTotalText>
        <Flex flexDirection='column'>
          <BillingTotalUnits>{billingInformation.unit || 'kW⋅h'}</BillingTotalUnits>
        </Flex>
      </Flex>
    </BillingTotalFlex>
  );
};

const BillingTotalFlex = styled(Flex)`
  padding: 0 19.5px;
  height: 91px;
  border-left: 1px solid ${colors.grayEEF3FA};
`;

const BillingTotalText = styled.span`
  line-height: ${isChrome ? 0.7 : 1};
  font-family: Aktiv Grotesk;
  font-size: 65px;
  font-weight: 500;
  color: ${colors.blue};
`;

const BillingTotalUnits = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.blue};
  margin-bottom: 22px;
`;

const WrappedTitle = styled(Title)<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? colors.blue : colors.grayCBD4E2)};
  cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
  z-index: 1;
  :first-of-type {
    margin-right: 10px;
  }
`;
