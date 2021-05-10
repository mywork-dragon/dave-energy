import React from 'react';
import styled from 'styled-components';

import { colors, DavidEnergyLogoMark, Flex } from 'design-system';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => (
  <FooterContainer className={className} alignItems="center">
    <a href="https://www.davidenergy.com">
      <DavidEnergyLogoMark />
    </a>
    <a href="https://www.davidenergy.com/terms-conditions">
      <LeftText>Terms & Conditions</LeftText>
    </a>
    <a href="https://www.davidenergy.com/contact-us">
      <LeftText>Contact Us</LeftText>
    </a>
    <RightText>
      {`© ${new Date().getFullYear()} David Energy. All rights reserved.`}
    </RightText>
  </FooterContainer>
);

const FooterContainer = styled(Flex)`
  padding: 0 50px;
  width: 100%;
  height: 100px;
  > * {
    margin-right: 50px;
  }
`;

const LeftText = styled.span`
  font-family: Soleil;
  font-size: 16px;
  font-weight: 350;
  color: ${colors.gray575E68};
`;

const RightText = styled.span`
  font-family: Soleil;
  font-size: 16px;
  font-weight: 300;
  color: ${colors.grayCBD4E2};
`;
