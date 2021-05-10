import styled from 'styled-components';

import { colors } from 'design-system';

export const Button = styled.button`
  width: 100%;
  height: 35px;
  font-family: Soleil;
  font-weight: 700;
  font-size: 13px;
  background-color: ${colors.blue};
  border-radius: 3px;
  color: ${colors.white};
  text-align: center;

  :disabled {
    background-color: ${colors.grayEEF3FA};
  }
`;
