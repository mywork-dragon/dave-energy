import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { activeBuildingIdParamKeyName } from 'app-constants';
import { colors, Flex, Title, IconArrowRight } from 'design-system';
import { RootState } from 'store';

interface Props {
  text: string;
  grayText: string;
  onClick(): void;
  path: string;
}

const addActiveBuildingIdToPath = (
  path: string,
  activeBuildingId: number,
): string => {
  return `${path}/?${activeBuildingIdParamKeyName}=${activeBuildingId}`;
};

export const AnalyticsCardTitle: React.FC<Props> = ({
  text,
  grayText,
  onClick,
  path,
}: Props) => {
  const activeBuildingId = useSelector(
    (state: RootState) => state.buildings.activeBuilding?.id,
  );
  const href = activeBuildingId
    ? addActiveBuildingIdToPath(path, activeBuildingId)
    : path;

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <span>
        <Title
          css={`
            display: inline-block;
            margin-right: 28px;
          `}
        >
          {text}
        </Title>
        <StyledGrayText onClick={onClick}>{grayText}</StyledGrayText>
      </span>

      <IconContainer href={href} target="_blank" rel="noopener noreferrer">
        <IconArrowRight color={colors.blue} />
      </IconContainer>
    </Flex>
  );
};

const IconContainer = styled.a`
  display: block;
  width: 30px;
  text-align: right;
  cursor: pointer;
`;

export const StyledGrayText = styled.span`
  display: inline-block;
  min-width: 65px;
  font-family: Aktiv Grotesk;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.grayCBD4E2};
  cursor: pointer;
`;
