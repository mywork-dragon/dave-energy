import { GreenhouseGasEmissionModel } from 'models';
import React from 'react';
import styled from 'styled-components';

import { colors, Flex, Title } from 'design-system';

const isChrome = /chrome/.test(navigator.userAgent.toLowerCase());

interface GreenhouseGasEmissionsProps {
  emission: GreenhouseGasEmissionModel | null;
}

export const GreenhouseGasEmissions: React.FC<GreenhouseGasEmissionsProps> = ({
  emission,
}) => {
  if (!emission) {
    return null;
  }

  const { unit } = emission;

  return (
    <GreenhouseGasEmissionsFlex flexDirection="column">
      <Title>Greenhouse Gas Emissions</Title>
      <Flex css="margin-top: 9px;">
        <GreenhouseGasEmissionsText style={{ marginRight: '14px' }}>
          {emission.getQuantityDisplay()}
        </GreenhouseGasEmissionsText>
        <Flex css={isChrome ? 'top: 11px;' : ''} flexDirection="column">
          <GreenhouseGasEmissionsUnits>{unit}</GreenhouseGasEmissionsUnits>
          <PercentChange color={emission.getPercentageColor()}>
            {emission.getPercentageDisplay()}
          </PercentChange>
        </Flex>
      </Flex>
    </GreenhouseGasEmissionsFlex>
  );
};

const GreenhouseGasEmissionsFlex = styled(Flex)`
  padding: 0 19.5px;
  height: 91px;
  border-right: 1px solid #eef3fa;
`;

const GreenhouseGasEmissionsText = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 65px;
  font-weight: 500;
  color: ${colors.blue};
`;

const GreenhouseGasEmissionsUnits = styled.span`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${colors.blue};
  margin-bottom: 22px;
`;

const PercentChange = styled.span<{ color: string }>`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${({ color }) => color};
`;
