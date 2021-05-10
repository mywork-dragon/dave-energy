import React from 'react';
import styled from 'styled-components';

import { OnboardingHeader, Footer } from './components';

interface OnboardingLayoutProps {
  children?: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
}) => {
  return (
    <OnboardingLayoutContainer>
      <WrappedHeader />
      {children}
      <WrappedFooter />
    </OnboardingLayoutContainer>
  );
};

const OnboardingLayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrappedHeader = styled(OnboardingHeader)`
  &&& {
    width: calc(100% - 46px * 2);
    position: absolute;
    top: 0;
    margin: 20px 46px;
  }
`;

const WrappedFooter = styled(Footer)`
  &&& {
    position: absolute;
    bottom: 0;
  }
`;
