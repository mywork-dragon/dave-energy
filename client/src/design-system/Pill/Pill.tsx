import React from 'react';
import styled from 'styled-components';

import { colors } from 'design-system';

interface Props {
  isActive?: boolean;
  children?: React.ReactNode;
  onClick?(): void;
}

export const Pill: React.FC<Props> = ({
  isActive = false,
  children = null,
  onClick = (): void => {},
}: Props) => {
  return (
    <StyledPill
      onClick={(): void => {
        !isActive && onClick();
      }}
      isActive={isActive}
    >
      {children}
    </StyledPill>
  );
};

const StyledPill = styled.span<Pick<Props, 'isActive'>>`
  display: block;
  padding-left: 14px;
  padding-right: 14px;
  height: 24px;
  line-height: 23px;
  text-align: center;
  border-radius: 12.5px;
  font-size: 13px;
  font-family: Aktiv Grotesk;
  font-weight: 500;
  background-color: ${({ isActive }): string =>
    isActive ? colors.blue : 'inherit'};
  color: ${({ isActive }): string =>
    isActive ? colors.white : colors.grayCBD4E2};
  cursor: ${({ isActive }): string => (isActive ? 'default' : 'pointer')};
`;
