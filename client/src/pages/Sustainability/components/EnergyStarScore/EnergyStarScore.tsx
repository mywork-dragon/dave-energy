import React from 'react';
import styled from 'styled-components';

import { colors, Title, Flex } from 'design-system';
import { EnergyStarRatingModel } from 'models';

const isChrome = /chrome/.test(navigator.userAgent.toLowerCase());

interface EnergyStarScoreProps {
  energyStarRating: EnergyStarRatingModel | null;
}

export const EnergyStarScore: React.FC<EnergyStarScoreProps> = ({
  energyStarRating,
}) => {
  if (!energyStarRating) {
    return null;
  }

  const { value } = energyStarRating;

  return (
    <EnergyStarScoreContainer
      flexDirection="column"
      justifyContent="space-between"
    >
      <Title css="margin-bottom: 14px;">Energy Star Score</Title>
      <Flex css="margin-bottom: 34px;">
        <Score value={value} color={energyStarRating.getValueColor()} />
        <Change color={energyStarRating.getChangeColor()}>
          {energyStarRating.getChangeDisplay()}
        </Change>
      </Flex>
    </EnergyStarScoreContainer>
  );
};

const EnergyStarScoreContainer = styled(Flex)`
  height: 100%;
  padding-left: 20px;
`;

export const Score = styled.div<
  Pick<EnergyStarRatingModel, 'value'> & { color: string }
>`
  font-family: Aktiv Grotesk;
  font-size: 31px;

  :before {
    content: '${({ value }) => value} ';
    font-weight: 500;
    color: ${({ color }) => color};
  }

  :after {
    content: ' / 100';
    font-weight: 300;
    color: ${colors.blue};
  }
`;

export const Change = styled.span<{ color: string }>`
  position: relative;
  top: ${isChrome ? '4px' : '0'};
  margin-left: 10px;
  font-size: 13px;
  color: ${({ color }) => color};
  line-height: 0.7;
`;
