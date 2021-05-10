import React from 'react';
import styled from 'styled-components';

import { colors, Flex, Pill } from 'design-system';

const mapIsTemperatureNormalizedToMessage = [
  'Your data is not normalized.',
  'Temperature',
];

interface Props {
  isTemperatureNormalized: number;
  toggleIsTemperatureNormalized(): void;
}

export const NormalizationSelector: React.FC<Props> = ({
  isTemperatureNormalized,
  toggleIsTemperatureNormalized,
}: Props) => (
  <div style={{'minWidth': '280px', 'borderLeft': `1px solid ${colors.grayEEF3FA}`, 'paddingLeft': '19px'}}>
    <Title>Normalization</Title>
    <Flex
      css={`
        & > span {
          &:not(:last-of-type) {
            margin-right: 15px;
          }
        }
      `}
    >
      <Pill onClick={toggleIsTemperatureNormalized} isActive={isTemperatureNormalized === 0}>
        None
      </Pill>
      <Pill onClick={toggleIsTemperatureNormalized} isActive={isTemperatureNormalized === 1}>
        Temperature
      </Pill>
    </Flex>
    <Message>
      {mapIsTemperatureNormalizedToMessage[isTemperatureNormalized]}
    </Message>
  </div>
);

const Title = styled.h3`
  font-family: Soleil;
  font-size: 13px;
  line-height: 22px;
  color: ${colors.blue};
  margin-bottom: 17px;
`;

const Message = styled.p`
  font-family: Soleil;
  font-size: 12px;
  line-height: 22px;
  color: ${colors.grayCBD4E2};
  margin-top: 6px;
`;
