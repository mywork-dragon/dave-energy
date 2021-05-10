import React from 'react';
import styled from 'styled-components';

import { colors, Flex } from 'design-system';

interface ToggleProps {
  className?: string;
  dataTn?: string;
  isDisabled?: boolean;
  isToggled: boolean;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Toggle: React.FC<ToggleProps> = ({
  className = '',
  dataTn = '',
  label = '',
  isDisabled = false,
  isToggled = false,
  onClick = (): void => {},
}) => {
  return (
    <StyledToggle
      className={className}
      alignItems="center"
      data-tn={dataTn}
      label={label}
      isDisabled={isDisabled}
      isToggled={isToggled}
      onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
        !isDisabled && onClick?.(e);
      }}
    >
      <Switch />
      <label>{label}</label>
    </StyledToggle>
  );
};

const Switch = styled.div``;

const StyledToggle = styled(Flex)<ToggleProps>`
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'cursor')};

  ${Switch} {
    :before {
      content: '';
      width: 20px;
      height: 20px;
      background-color: ${colors.white};
      top: 1px;
      left: ${({ isToggled }) => (isToggled ? 17 : 1)}px;
      display: inline-block;
      position: relative;
      border-radius: 12px;
      transition: 300ms all;
    }

    width: 38px;
    height: 22px;
    display: inline-block;
    position: relative;
    background-color: ${({ isToggled }) =>
      isToggled ? colors.error : colors.grayCBD4E2};
    border-radius: 12px;
    transition: 300ms all;
  }

  label {
    display: inline-block;
    margin-left: 10px;
    font-family: Soleil;
    font-size: 13px;
    font-weight: 350;
    color: ${({ isToggled }) => (isToggled ? colors.error : colors.grayCBD4E2)};
    transition: 300ms all;
  }
`;
