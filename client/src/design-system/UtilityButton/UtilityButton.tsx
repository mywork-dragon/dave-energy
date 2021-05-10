import React from 'react';
import styled from 'styled-components';

import { colors, BaseIconHOCType, IconDropdownArrow } from 'design-system';

interface OwnProps {
  children?: string;
  className?: string;
  dataTn?: string;
  Icon?: BaseIconHOCType;
  isActive?: boolean;
  text?: string | null;
  hasIconDropdown?: boolean;
}

type Props = OwnProps & React.HTMLAttributes<HTMLButtonElement>;

export const UtilityButton: React.FC<Props> = ({
  children,
  className,
  dataTn,
  Icon,
  isActive = false,
  text = '',
  hasIconDropdown,
  ...props
}) => {
  return (
    <StyledUtilityButton
      data-tn={dataTn}
      className={className}
      isActive={isActive}
      {...props}
    >
      {typeof Icon === 'function' && (
        <IconWrapper>
          <Icon color={isActive ? colors.blue : colors.grayCBD4E2} />
        </IconWrapper>
      )}
      {text || children || ''}
      {hasIconDropdown && (
        <IconDropdownArrow css="margin-left: 12px;" color={colors.blue} />
      )}
    </StyledUtilityButton>
  );
};

const StyledUtilityButton = styled.button<Pick<Props, 'isActive'>>`
  font-family: Soleil;
  font-size: 13px;
  font-weight: 350;
  color: ${({ isActive }) => (isActive ? colors.blue : colors.grayCBD4E2)};
  background-color: unset;
  padding: 0;
  cursor: pointer;
  border: unset;
  border-bottom: ${({ isActive }) =>
    isActive ? `2px solid ${colors.blue}` : 'none'};
  padding-top: 20px;
  padding-bottom: 20px;
`;

const IconWrapper = styled.span`
  position: relative;
  margin-right: 10px;
  top: 6px;
`;
