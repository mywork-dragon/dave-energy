import React from 'react';
import styled from 'styled-components';

import { colors } from 'design-system';

interface LegendButtonProps {
  activeColor?: string;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  children: string;
}

export const LegendButton: React.FC<LegendButtonProps> = ({
  className,
  children,
  activeColor,
  isActive,
  onClick,
}) => {
  return (
    <StyledLegendButton
      activeColor={activeColor}
      className={className}
      isActive={isActive}
      onClick={onClick}
      data-tn={`legendButton-${children.toLowerCase()}${
        isActive ? '-active' : ''
      }`}
    >
      {children}
    </StyledLegendButton>
  );
};

const StyledLegendButton = styled.button<
  Pick<LegendButtonProps, 'activeColor' | 'isActive' | 'onClick'>
>`
  text-transform: uppercase;
  height: 35px;
  padding: 10px 12px;
  border-radius: 3px;
  border: unset;
  color: ${colors.white};
  font-family: Soleil;
  font-size: 13px;
  font-weight: 700;
  background-color: ${({ activeColor, isActive }) =>
    isActive ? activeColor : colors.grayE6EAEF};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.3);
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  line-height: 10px;

  :not(:last-of-type) {
    margin-right: 5px;
  }
`;
