import React from 'react';
import styled, { css } from 'styled-components';

import { colors, Flex } from 'design-system';
import { BuildingEngineerAnalyticsModel, EnergyStarRatingModel } from 'models';

interface CardChartCategoriesProps {
  className?: string;
  models: BuildingEngineerAnalyticsModel[] | EnergyStarRatingModel[] | null;
}

export const CardChartCategories: React.FC<CardChartCategoriesProps> = ({
  className,
  models,
}) => {
  if (!models || !models?.length) {
    return null;
  }

  const currentMonth = new Date().getMonth() + 1;

  const ModelToMonths = () => {
    if (models[0] instanceof BuildingEngineerAnalyticsModel) {
      return (models as any).map((demand: any) => (
        <Month
          key={demand.monthNumber!}
          isPast={demand.monthNumber! < currentMonth}
          isCurrent={demand.monthNumber! === currentMonth}
          isFuture={demand.monthNumber! > currentMonth}
        >
          {demand.monthDisplay}
        </Month>
      ));
    } else {
      return (models as any).map((demand: any) => (
        <Month
          key={demand.month!}
          isPast={demand.month! < currentMonth}
          isCurrent={demand.month! === currentMonth}
          isFuture={demand.month! > currentMonth}
        >
          {demand.monthDisplay}
        </Month>
      ));
    }
  };

  return (
    <Flex className={className} css={`z-index: 1;`} justifyContent='space-between'>
      <ModelToMonths />
    </Flex>
  );
};

interface MonthProps {
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
}

const Month = styled.div<MonthProps>`
  font-family: Aktiv Grotesk;
  font-size: 11px;
  font-weight: 700;

  ${({ isPast, isCurrent, isFuture }) => {
    if (isPast) {
      return css`
        color: ${colors.grayCBD4E2};
      `;
    } else if (isCurrent) {
      return css`
        display: flex;
        justify-content: center;
        position: relative;
        width: 20px;
        height: 20px;
        color: ${colors.white};
        z-index: 1;
        border-radius: 20px;
        background-color: ${colors.blue};
        bottom: 6px;
        line-height: 1.9;
        margin: 0 -5px;
      `;
    } else if (isFuture) {
      return css`
        color: ${colors.grayEEF3FA};
      `;
    }
  }}
`;
