import { MouseEventHandler } from 'react';
import styled from 'styled-components';

import { colors } from '../colors';

interface AvatarProps {
  imgUrl?: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export const Avatar = styled.div<AvatarProps>`
  width: 40px;
  height: 40px;
  background: ${({ imgUrl }) =>
    imgUrl ? `url("${imgUrl}")` : colors.gray575E68};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
`;
