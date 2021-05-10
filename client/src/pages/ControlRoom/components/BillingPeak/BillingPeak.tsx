import React from 'react';
import styled from 'styled-components';
import { BillingInformationModel } from 'models';

import { colors, Flex, Title } from 'design-system';

interface OwnProps {
  billingInformation: BillingInformationModel | null;
}

export const BillingPeak: React.FC<OwnProps> = ({ billingInformation }) => {
  if (!billingInformation || !billingInformation.billingPeak) {
    return null;
  }

  const { quantity, target, targeted, ts } = billingInformation.billingPeak;

  return (
    <BillingPeakFlex flexDirection="column">
      <Title css="margin-bottom: 24px;">Billing Peak</Title>
      <Flex style={{ marginBottom: '9.5px' }}>
        <BillingPeakText
          data-tn="billingPeak-quantity"
          style={{ marginRight: '8.5px' }}
        >
          {quantity?.toLocaleString('en')}
        </BillingPeakText>
        <BillingTargetText>/ {target?.toLocaleString('en')}</BillingTargetText>
        <BillingPeakUnits>kW</BillingPeakUnits>
      </Flex>
      <Flex>
        <BillingPeakDateTime data-tn="billingPeak-date-display">
          {billingInformation.getDateDisplay(ts!)}
        </BillingPeakDateTime>
        <BillingPeakTargeted targeted={targeted!}>Targeted</BillingPeakTargeted>
      </Flex>
    </BillingPeakFlex>
  );
};

const BillingPeakFlex = styled(Flex)`
  padding: 0 19.5px;
  height: 91px;
`;

const BillingPeakText = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
  color: ${colors.blue};
`;

const BillingTargetText = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 300;
  color: ${colors.blue};
`;

const BillingPeakDateTime = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.blue};
  text-transform: uppercase;
`;

const BillingPeakUnits = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.blue};
  margin-left: 8px;
`;

const BillingPeakTargeted = styled(BillingPeakDateTime)<{
  targeted: number;
}>`
  font-weight: 400;
  text-transform: none;

  :before {
    content: '/';
    margin: 0 8px;
  }

  :after {
    content: ${({ targeted }) =>
      targeted! < 0 ? `"- ${targeted! * -1}%"` : `"+ ${targeted}%"`};
    color: ${({ targeted }) => (targeted! < 0 ? colors.green : colors.error)};
    margin-left: 6px;
  }
`;
