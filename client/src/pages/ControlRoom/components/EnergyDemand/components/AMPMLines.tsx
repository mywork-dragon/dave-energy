import React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'design-system';

export const AMPMLines = () => (
  <>
    <AMLine />
    <PMLine />
    <RightBorder />
  </>
);

const amPmCssMixin = css`
  height: 540px;
  font-family: Aktiv Grotesk;
  font-size: 11px;
  font-weight: 500;
  color: ${colors.grayBCC1C9};
  position: absolute;
  height: 100%;
  border-left: 1px solid ${colors.grayEEF3FA};
  top: 50px;
  z-index: 2;
`;

const AMLine = styled.div`
  ${amPmCssMixin};
  margin-left: 43px;

  :after {
    content: 'AM';
    margin-left: 5px;
  }
`;

const PMLine = styled.div`
  ${amPmCssMixin};
  left: 50%;

  :after {
    content: 'PM';
    margin-left: 5px;
  }
`;

const RightBorder = styled.div`
  ${amPmCssMixin};
  margin-right: 44px;
  right: 0px;
`;
