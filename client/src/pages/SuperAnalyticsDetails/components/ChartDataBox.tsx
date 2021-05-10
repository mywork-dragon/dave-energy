import React from 'react';
import styled from 'styled-components';

import { colors } from 'design-system';

interface Props {
  unit: string | null;
  value: string | null;
  label: string | null;
  unitColor?: string;
}

export const ChartDataBox: React.FC<Props> = ({
  unit,
  value,
  label,
  unitColor,
}: Props) => {
  return (
    <div>
      <StyledValue unit={unit} unitColor={unitColor}>
        {value}
      </StyledValue>
      <StyledLabel unitColor={unitColor}>{label}</StyledLabel>
    </div>
  );
};

const StyledValue = styled.div<{ unit?: string | null; unitColor?: string }>`
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
  line-height: 39px;
  color: ${({ unitColor }): string => (unitColor ? unitColor : colors.blue)};
  margin-bottom: 10px;
  height: 39px;
  text-align: center;

  ${({ unit }): string =>
    unit
      ? `&:after {
    content: '${unit}';
    font-size: 13px;
    bottom: 12px;
    position: relative;
    margin-left: 6px;
  }`
      : ''}
`;

const StyledLabel = styled.p<{ unitColor?: string }>`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ unitColor }): string => (unitColor ? unitColor : colors.blue)};
`;
