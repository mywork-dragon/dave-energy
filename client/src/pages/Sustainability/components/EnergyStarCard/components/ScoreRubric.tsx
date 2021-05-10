import React from 'react';
import styled from 'styled-components';

import { colors, Flex } from 'design-system';
import { EnergyStarRatingModel } from 'models';
import './styles.less';

interface Props {
  className?: string;
  rating: EnergyStarRatingModel | null;
}

export const ScoreRubric: React.FC<Props> = ({ className, rating }) => {
  const score = rating?.value ?? null;
  return (
    <Flex className={className} css="height: 124px;" alignItems="center">
      <RubricLine color={rating?.getValueColor() ?? ''} score={score!} />
      <RubricContainer flexDirection="column" justifyContent="space-between">
        <RubricRow isActive={score !== null && score > 74}>
          <RubricRange>75-100</RubricRange>
          <RubricColor>Green</RubricColor>
        </RubricRow>
        <RubricRow isActive={score !== null && score > 25 && score < 75}>
          <RubricRange>26-74</RubricRange>
          <RubricColor>Yellow</RubricColor>
        </RubricRow>
        <RubricRow isActive={score !== null && score < 26}>
          <RubricRange>0-25</RubricRange>
          <RubricColor>Red</RubricColor>
        </RubricRow>
      </RubricContainer>
    </Flex>
  );
};

const RubricContainer = styled(Flex)`
  width: 167px;
  height: 120px;
  padding-left: 27.5px;
  border-left: 1px solid ${colors.grayEEF3FA};
`;

const RubricLine = styled.div<{ color: string; score: number | null }>`
  :before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background-color: ${({ color }) => color};
    border: 3px solid ${colors.white};
    border-radius: 50%;
    right: 4px;
    bottom: -4px;
    position: relative;
  }

  background-color: ${({ color }) => color};
  width: 4px;
  height: ${({ score }) => {
    if (score === null) {
      return 0;
    } else if (score > 74) {
      return 121;
    } else if (score > 25 && score < 75) {
      return 71;
    } else if (score < 26) {
      return 20;
    }
  }}px;
  position: absolute;
  bottom: 1px;
  left: -1.5px;
  z-index: 1;
  border-radius: 4px;
`;

const RubricRow = styled(Flex)<{ isActive: boolean }>`
  width: 100%;
  justify-content: space-between;
  > * {
    color: ${({ isActive }) => (isActive ? colors.blue : colors.grayCBD4E2)};
  }
`;

const RubricRange = styled.span`
  font-family: Soleil;
  font-size: 19px;
  font-weight: 700;
`;

const RubricColor = styled(RubricRange)`
  width: 54px;
  font-weight: 400;
`;
