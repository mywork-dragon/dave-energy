import React from 'react';
import styled from 'styled-components';

import { colors } from 'design-system';

interface OwnProps {
  className?: string;
  isInvalid?: boolean;
  forwardRef?: any;
}

type InputProps = OwnProps &
  React.HTMLAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ forwardRef, ...props }) => (
  <StyledInput ref={forwardRef} {...props} />
);

const StyledInput = styled.input<Pick<OwnProps, 'isInvalid'>>`
  width: 460px;
  height: 60px;
  border-radius: 3px;
  background-color: ${colors.white};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.15);
  color: ${({ isInvalid }) => (isInvalid ? colors.error : colors.lightBlue)};
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
  padding: 6px 14px 0 14px;
  box-sizing: border-box;
  border-radius: 3px;
  caret-color: ${colors.lightBlue};

  :placeholder-shown {
    color: ${colors.grayEEF3FA};
  }
`;
