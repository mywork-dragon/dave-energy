import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Layout } from 'components/Layouts';
import { colors, Flex } from 'design-system';
import { Calendar } from 'components';
import {
  BillingCycle,
  BillingPeak,
  BillingTotal,
  DayIncrementer,
  EnergyDemand,
  EventSchedule,
} from './components';
import {
  BillingInformationModel,
  EnergyDemandModel,
  EventScheduleModel,
} from 'models';
import {
  getBillingInformation,
  getBillingSolarInformation,
} from 'store/billing';
import {
  getEventSchedule,
  getEnergyDemand,
} from 'store/buildings';
import { RootState } from 'store';
import { formatDatetime } from 'utils';

interface StoreStateProps {
  billingInformation: BillingInformationModel | null;
  billingSolarInformation: BillingInformationModel | null;
  // TODO: Maybe find a better name instead of 'date'. This represents the app
  // time which is set by the calendar & time components and sent to all the
  // APIs that accept the 'from_time' query parameter.
  date: Date;
  energyDemand: EnergyDemandModel | null;
  eventSchedule: EventScheduleModel[] | null;
  activeBuildingId: number | null;
}

interface StoreDispatchProps {
  getBillingInformation: typeof getBillingInformation;
  getBillingSolarInformation: typeof getBillingSolarInformation;
  getEventSchedule: typeof getEventSchedule;
  getEnergyDemand: typeof getEnergyDemand;
}

// TODO: add this to store state and make dynamic
const DEFAULT_ENERGY_TYPE = 'electric';
const EVENT_SCHEDULE_INTERVAL = 60000;  // 1 min

type Props = StoreDispatchProps & StoreStateProps;

export class ControlRoomComponent extends React.Component<Props> {
  eventScheduleInterval: any = null;

  constructor(props: Props) {
    super(props);
    this.fetchData();
  }

  public componentDidUpdate(prevProps: Props) {
    const {
      activeBuildingId,
      eventSchedule,
    } = this.props;

    if (activeBuildingId === null) {
      return;
    }

    const hasBuildingChanged = prevProps.activeBuildingId !== activeBuildingId;
    const hasDateChanged = prevProps.date !== this.props.date;

    if (hasBuildingChanged || hasDateChanged) {
      this.fetchData();
    }

    if (eventSchedule) {
      const activeEventExists = eventSchedule.some(schedule => schedule.status === 'ACTIVE');
      if (activeEventExists) {
        this.setEventScheduleInterval();
      }
    } else {
      this.clearEventScheduleInterval();
    }
  }

  public componentWillUnmount() {
    this.clearEventScheduleInterval();
  }

  private clearEventScheduleInterval() {
    if (this.eventScheduleInterval) {
      clearInterval(this.eventScheduleInterval);
    }
  }

  private setEventScheduleInterval() {
    const { activeBuildingId, date, getEventSchedule } = this.props;
    const fromDate = formatDatetime(date);
    this.clearEventScheduleInterval();
    this.eventScheduleInterval = setInterval(() => {
      getEventSchedule(activeBuildingId!, fromDate);
    }, EVENT_SCHEDULE_INTERVAL);
  }

  private fetchData() {
    const {
      activeBuildingId,
      date,
      getBillingInformation,
      getBillingSolarInformation,
      getEventSchedule,
      getEnergyDemand,
    } = this.props;

    if (!activeBuildingId) {
      return;
    }

    const fromDate = formatDatetime(date);
    const toDate = new Date(fromDate);
    toDate.setUTCHours(24);
    let toTimeJSON = toDate.toJSON();
    toTimeJSON = toTimeJSON.replace('Z', '');

    getBillingInformation(activeBuildingId, fromDate);
    getBillingSolarInformation(activeBuildingId, fromDate);
    getEventSchedule(activeBuildingId, fromDate);
    getEnergyDemand(activeBuildingId, fromDate, toTimeJSON, DEFAULT_ENERGY_TYPE);
  }

  public render() {
    const {
      billingInformation,
      billingSolarInformation,
      energyDemand,
      eventSchedule,
    } = this.props;

    return (
      <Layout isHeaderSticky>
        <ControlRoomHeader alignItems='center'>
          <CalendarWrapper flexDirection='column' justifyContent='space-between'>
            <DayIncrementer />
            <Calendar useWeekdaysShort dateDisplayFormat='day' />
          </CalendarWrapper>
          <BillingCycle billingInformation={billingInformation} />
          <BillingPeak billingInformation={billingInformation} />
          <BillingTotal billingInformation={billingInformation} />
          {billingSolarInformation?.billingCycleSolarTotal && (
            <BillingTotal billingInformation={billingSolarInformation} />
          )}
        </ControlRoomHeader>
        <EnergyDemand demand={energyDemand} />
        <EventSchedule schedule={eventSchedule} />
      </Layout>
    );
  }
}

const ControlRoomHeader = styled(Flex)`
  position: sticky;
  top: 80px;
  margin-bottom: 40px;
  padding: 18px 46px;
  box-shadow: 0 30px 30px -30px rgba(87, 94, 104, 0.1);
  height: 121px;
  background-color: ${colors.white};
  z-index: 3;
`;

const CalendarWrapper = styled(Flex)`
  height: 91px;
  padding-right: 19px;
  border-right: 1px solid ${colors.grayEEF3FA};
`;

function mapStateToProps(state: RootState): StoreStateProps {
  return {
    activeBuildingId: state.buildings?.activeBuilding?.id ?? null,
    billingInformation: state.billing?.billingInformation ?? null,
    billingSolarInformation: state.billing?.billingSolarInformation ?? null,
    date: state.time.instance,
    energyDemand: state.buildings?.energyDemand ?? null,
    eventSchedule: state.buildings?.eventSchedule ?? null,
  };
}

function mapDispatchToProps(dispatch: any): StoreDispatchProps {
  return {
    getBillingInformation: (buildingId, fromTime) =>
      dispatch(getBillingInformation(buildingId, fromTime)),
    getBillingSolarInformation: (buildingId, fromTime) =>
      dispatch(getBillingSolarInformation(buildingId, fromTime)),
    getEventSchedule: (buildingId, fromTime) =>
      dispatch(getEventSchedule(buildingId, fromTime)),
    getEnergyDemand: (buildingId, fromTime, toTime, DEFAULT_ENERGY_TYPE) =>
      dispatch(getEnergyDemand(buildingId, fromTime, toTime, DEFAULT_ENERGY_TYPE)),
  };
}

export const ControlRoomPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ControlRoomComponent);
