import React from 'react';
import styled from 'styled-components';

import { colors, Flex, IconArrowLeft } from 'design-system';

export const OnboardingHeader: React.FC<{ className?: string }> = ({
  className,
}) => (
  <Flex
    className={className}
    alignItems="center"
    justifyContent="space-between"
  >
    <BackText href="https://davidenergy.com">
      <IconArrowLeft css="margin-right: 8px;" color={colors.blue} />
      Back
    </BackText>
    <Flex alignItems="center">
      <GetStartedText>Don&apos;t have an account yet?</GetStartedText>
      <GetStartedButton>Get Started</GetStartedButton>
    </Flex>
  </Flex>
);

const BackText = styled.a`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 350;
  color: ${colors.blue};
  padding: 12px;
  margin: -12px;
`;

const GetStartedText = styled.span`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 350;
  color: ${colors.grayCBD4E2};
  margin-right: 20px;
`;

const GetStartedButton = styled.button`
  width: 145px;
  height: 48px;
  font-family: Soleil;
  font-size: 15px;
  color: ${colors.white};
  background-color: ${colors.green};
  border-radius: 2px;
`;
