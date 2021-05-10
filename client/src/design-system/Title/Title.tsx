import React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'design-system';

interface TitleProps {
  className?: string;
  children?: React.ReactNode;
  dataTn?: string;
  onClick?: () => void;
  size?: 'small' | 'large';
  color?: string;
}

export const Title: React.FC<TitleProps &
  React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  dataTn,
  onClick,
  size = 'small',
  color,
  ...props
}) => {
  return (
    <StyledTitle
      data-tn={dataTn}
      className={className}
      onClick={onClick}
      size={size}
      color={color}
      {...props}
    >
      {children}
    </StyledTitle>
  );
};

export const StyledTitle = styled.h3<Pick<TitleProps, 'size' | 'color'>>`
  color: ${({ color }): string => color || colors.blue};
  ${({ size }) =>
    size === 'small'
      ? css`
          font-family: Soleil;
          font-size: 13px;
          font-weight: 350;
        `
      : css`
          font-family: Aktiv Grotesk;
          font-size: 31px;
          font-weight: 500;
        `}
`;
