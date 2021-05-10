import React from 'react';
import styled from 'styled-components';

import { Title, colors, Flex } from 'design-system';
import { BillingInformationModel } from 'models';

interface BillingCycleProps {
  billingInformation: BillingInformationModel | null;
}

export const BillingCycle: React.FC<BillingCycleProps> = ({
  billingInformation,
}) => {
  if (!billingInformation || !billingInformation.billingCycle) {
    return null;
  }

  const { daysLeft, fromDate, toDate } = billingInformation.billingCycle;

  return (
    <BillingCycleFlex flexDirection="column">
      <WrappedTitle>Billing Cycle</WrappedTitle>
      <DaysLeft style={{ paddingBottom: '9.5px' }}>{daysLeft} days</DaysLeft>
      <DateRange>
        {fromDate} - {toDate}
      </DateRange>
    </BillingCycleFlex>
  );
};

const BillingCycleFlex = styled(Flex)`
  height: 90px;
  padding: 0 19.5px;
  border-right: 1px solid ${colors.grayEEF3FA};
`;

const DaysLeft = styled.span`
  color: ${colors.blue};
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
`;

const DateRange = styled.span`
  color: ${colors.blue};
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
`;

const WrappedTitle = styled(Title)`
  margin-bottom: 24px;
`;
