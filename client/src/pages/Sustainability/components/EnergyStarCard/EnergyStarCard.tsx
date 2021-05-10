import React from 'react';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { CardChartCategories } from 'components';
import { Score, Change } from 'pages/Sustainability/components/EnergyStarScore';
import { EnergyStarRatingModel } from 'models';
import { chartOptions, ScoreRubric } from './components';
import { colors, Flex, Title, EnergyStarLogo } from 'design-system';

interface EnergyStarCardProps {
  ratings: EnergyStarRatingModel[] | null;
}

export const EnergyStarCard: React.FC<EnergyStarCardProps> = ({ ratings }) => {
  const currentRating = EnergyStarRatingModel.getEnergyStarRatingByMonth(
    ratings ?? [],
    new Date().getMonth() + 1,
  );

  if (!currentRating || !ratings) {
    return null;
  }

  return (
    <EnergyStarCardContainer>
      <Flex justifyContent="space-between">
        <Title css="margin-bottom: 50px; display: inline-block">
          Energy Star Rating
        </Title>
        <WrappedEnergyStarIcon />
      </Flex>
      <Score
        css="font-size: 65px;"
        value={currentRating.value}
        color={currentRating.getValueColor()}
      />
      <Flex
        css="margin: 16px 0 50px 0; width: 312px;"
        justifyContent="space-between"
      >
        <Title>Energy Star Score</Title>
        <Change css="top: unset;" color={currentRating.getChangeColor()}>
          {currentRating.getChangeDisplay()}
        </Change>
      </Flex>
      <Flex>
        <Flex alignItems="flex-end">
          <ChartContainer css="margin-left: -10px">
            <CardChartCategories
              css="margin: 0px 10px -6px 11px;"
              models={ratings}
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                ...chartOptions,
                series: [
                  EnergyStarRatingModel.generateSeriesAreaOptions(ratings),
                ],
              }}
            />
          </ChartContainer>
          <ScoreRubric css="margin: 0 0 4px 52px;" rating={currentRating} />
        </Flex>
      </Flex>
    </EnergyStarCardContainer>
  );
};

const EnergyStarCardContainer = styled.div`
  width: 608px;
  background-color: ${colors.white};
  border: 1px solid ${colors.grayEEF3FA};
  border-radius: 2px;
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.1);
  padding: 20.5px 29.5px;
`;

const ChartContainer = styled.div`
  width: 330px;
  height: 201px;
`;

const WrappedEnergyStarIcon = styled(EnergyStarLogo)`
  width: 66px;
  height: 66px;
  margin: -9px;
`;
