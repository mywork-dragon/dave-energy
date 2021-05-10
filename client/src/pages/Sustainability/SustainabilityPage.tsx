import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getBuildings,
  getEnergyStarRatings,
  getGreenhouseGasEmissions,
} from 'store/buildings';
import { RootState } from 'store';
import { Calendar, Layout } from 'components';
import { GreenhouseGasEmissionModel, EnergyStarRatingModel } from 'models';
import {
  Emissions,
  EnergyStarCard,
  EnergyStarScore,
  GreenhouseGasEmissions,
} from './components';
import { colors, Flex, Title } from 'design-system';

interface StoreStateProps {
  activeBuildingId: number | null;
  date: Date;
  energyStarRatings: EnergyStarRatingModel[] | null;
  greenhouseGasEmissions: GreenhouseGasEmissionModel[] | null;
}

interface StoreDispatchProps {
  getBuildings: typeof getBuildings;
  getEnergyStarRatings: typeof getEnergyStarRatings;
  getGreenhouseGasEmissions: typeof getGreenhouseGasEmissions;
}

type Props = StoreStateProps & StoreDispatchProps;

class SustainabilityPageComponent extends React.Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const { activeBuildingId, date } = this.props;
    const {
      activeBuildingId: prevActiveBuildingId,
      date: prevDate,
    } = prevProps;

    if (activeBuildingId !== prevActiveBuildingId || date !== prevDate) {
      this.fetchData();
    }
  }

  fetchData() {
    const {
      activeBuildingId,
      getGreenhouseGasEmissions,
      getEnergyStarRatings,
      date,
    } = this.props;

    if (activeBuildingId) {
      const year = date.getFullYear();
      getGreenhouseGasEmissions(activeBuildingId, year);
      getEnergyStarRatings(activeBuildingId, year);
    }
  }

  render() {
    const { energyStarRatings, greenhouseGasEmissions } = this.props;

    return (
      <Layout isHeaderSticky>
        <SustainabilityHeader
          alignItems="center"
          justifyContent="space-between"
        >
          <Calendar
            showYearPicker
            maxDate={new Date()}
            dateDisplayFormat="year"
          />
          <Flex>
            <GreenhouseGasEmissions
              emission={GreenhouseGasEmissionModel.getGreenhouseGasEmissionByMonth(
                greenhouseGasEmissions ?? [],
                new Date().getMonth() + 1,
              )}
            />
            <EnergyStarScore
              energyStarRating={EnergyStarRatingModel.getEnergyStarRatingByMonth(
                energyStarRatings ?? [],
                new Date().getMonth() + 1,
              )}
            />
          </Flex>
        </SustainabilityHeader>
        <SustainabilityPageContainer>
          <Emissions emissions={greenhouseGasEmissions} />
          <Title
            css={`
              margin-top: 99.5px;
              margin-bottom: 49.5px;
            `}
            size="large"
          >
            Performance
          </Title>
          <EnergyStarCard ratings={energyStarRatings} />
        </SustainabilityPageContainer>
      </Layout>
    );
  }
}

const SustainabilityPageContainer = styled.div`
  padding: 0 50.5px 59.5px 50.5px;
`;

function mapStateToProps(state: RootState): StoreStateProps {
  return {
    activeBuildingId: state.buildings?.activeBuilding?.id ?? null,
    date: state.time?.instance,
    energyStarRatings: state.buildings?.energyStarRatings ?? null,
    greenhouseGasEmissions: state.buildings?.greenhouseGasEmissions ?? null,
  };
}

function mapDispatchToProps(dispatch: any): StoreDispatchProps {
  return {
    getBuildings: () => dispatch(getBuildings()),
    getGreenhouseGasEmissions: (buildingId, year) =>
      dispatch(getGreenhouseGasEmissions(buildingId, year)),
    getEnergyStarRatings: (buildingId, year) =>
      dispatch(getEnergyStarRatings(buildingId, year)),
  };
}

export const SustainabilityPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SustainabilityPageComponent);

const SustainabilityHeader = styled(Flex)`
  position: sticky;
  top: 80px;
  margin-bottom: 40px 50.5px;
  padding: 18px 50.5px;
  box-shadow: 0 30px 30px -30px rgba(87, 94, 104, 0.1);
  height: 129px;
  background-color: ${colors.white};
  z-index: 3;
`;
