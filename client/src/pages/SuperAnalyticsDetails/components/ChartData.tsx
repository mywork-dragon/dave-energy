import React from 'react';

import { getPtcColor } from 'utils';
import { colors, Flex } from 'design-system';
import { getYearUnit } from '../utils/getYearUnit';
import { ChartDataBox } from '.';

interface YearData {
  label: string | null;
  value: string | null;
  unit: string | null;
}

interface Props {
  currentYear?: YearData | null;
  lastYear?: YearData | null;
  ptcChange?: string | null;
}

export const ChartData: React.FC<Props> = ({
  currentYear,
  lastYear,
  ptcChange,
}: Props) => {
  const currentYearUnit = getYearUnit(currentYear);
  const lastYearUnit = getYearUnit(lastYear);
  return (
    <Flex
      css={`
        margin-top: 29px;
        & > div {
          &:not(:last-of-type) {
            margin-right: 50px;
          }
        }
      `}
    >
      {lastYear && (
        <ChartDataBox
          unit={lastYearUnit}
          value={lastYear.value}
          label={lastYear.label}
          unitColor={colors.grayCBD4E2}
        />
      )}
      {currentYear && (
        <ChartDataBox
          unit={currentYearUnit}
          value={currentYear.value}
          label={currentYear.label}
        />
      )}
      {ptcChange && (
        <ChartDataBox
          unit={null}
          value={ptcChange}
          label="Actual Change"
          unitColor={getPtcColor(ptcChange)}
        />
      )}
    </Flex>
  );
};
