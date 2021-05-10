import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { colors, Flex, IconRevert, Title, Spinner } from 'design-system';
import { EventScheduleModel, SetPoint } from 'models';
import { revertPoint } from 'store/entity';
import { RootState } from 'store';


interface SetPointRowProps {
  dispatchId: number;
  setPoint: SetPoint;
  status: string;
}

const SetPointsHeader = () => (
  <StyledSetPointHeader alignItems='center' justifyContent='space-between'>
    <SetPointItem />
    <SetPointItem />
    <SetPointItem />
    <SetPointItem />
    <SetPointItem />
    <WrappedSetPointTitle>Default Set Point</WrappedSetPointTitle>
    <WrappedSetPointTitle>Event Set Point</WrappedSetPointTitle>
  </StyledSetPointHeader>
);

const SetPointRow: React.FC<SetPointRowProps> = ({
  dispatchId,
  setPoint,
  status,
}) => {
  const buildingId = useSelector(({ buildings }: RootState) => buildings!.activeBuilding!.id);
  const date = useSelector(({ time }: RootState) => time.instance);
  const dispatch = useDispatch();

  const {
    defaultSetPoint,
    eventSetPoint,
    pointName,
    revertEnabled,
    revertPointId,
  } = setPoint;

  const defaultSetPointString = `${defaultSetPoint?.value ?? 0} ${defaultSetPoint.unit}`;
  const eventSetPointString = `${eventSetPoint?.value ?? 0} ${eventSetPoint.unit}`;

  // Send PATCH request. If successful, the action will dispatch another
  // action, FETCH_BUILDING_EVENT_SCHEDULE. This will refresh the event
  // schedule view with the same set point pointId as null, therefore hiding
  // the button that originally handled this click
  const handleRevertPoint = (revertPointId: number, dispatchId: number) => {
    if (revertEnabled) {
      dispatch(revertPoint(buildingId!, revertPointId, dispatchId, date));
    }
  };

  const isLoading = useSelector(({ entity }: RootState) => {
    if (entity?.loadingIds) {
      const {
        buildingId: loadingBuildingId,
        dispatchId: loadingDispatchId,
        revertPointId: loadingRevertPointId,
      } = entity.loadingIds;
      return (
        loadingBuildingId === buildingId &&
        loadingDispatchId === dispatchId &&
        loadingRevertPointId === revertPointId &&
        revertEnabled
      );
    }
    return false;
  });

  return (
    <SetPointRowFlex alignItems='center' justifyContent='space-between'>
      <SetPointItem />
      <SetPointItem />
      <SetPointItem />
      <SetPointItem />
      <SetPointAsset data-tn='setPointRow-name'>{pointName}</SetPointAsset>
      <DefaultSetPointValue data-tn='setPointRow-defaultSetPoint'>
        {defaultSetPointString}
      </DefaultSetPointValue>
      <EventSetPointValue data-tn='setPointRow-eventSetPoint' status={status}>
        {eventSetPointString}
      </EventSetPointValue>
      {(revertPointId && status === 'ACTIVE') ? (
        <WrappedIconRevert
          revertEnabled={revertEnabled}
          onClick={handleRevertPoint.bind(null, revertPointId, dispatchId)}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <IconRevert dataTn='setPointRow-revertButton' color={revertEnabled ? colors.blue : colors.grayBCC1C9} />
          )}
        </WrappedIconRevert>
      ) : null}
    </SetPointRowFlex>
  );
};

interface EventScheduleRowProps {
  schedule: EventScheduleModel;
}

const EventScheduleRow: React.FC<EventScheduleRowProps> = ({ schedule }) => {
  const {
    asset,
    dispatchId,
    startDate,
    endDate,
    status,
    event,
    realTimeReduction,
    targetReduction,
    settingPoints,
  } = schedule;

  return (
    <EventScheduleRowContainer data-tn='eventScheduleContainer'>
      <EventScheduleRowFlex data-tn='eventScheduleRow' alignItems='center' justifyContent='space-between'>
        <ItemStatus data-tn='eventScheduleRow-status' status={status}>
          {status}
        </ItemStatus>
        <ItemText data-tn='eventScheduleRow-event' status={status}>
          {event}
        </ItemText>
        <StartTime data-tn='eventScheduleRow-startDate' status={status}>
          {schedule.getDateDisplay(startDate)}
        </StartTime>
        <ItemText data-tn='eventScheduleRow-endDate' status={status}>
          {schedule.getDateDisplay(endDate)}
        </ItemText>
        <ItemBold data-tn='eventScheduleRow-asset' status={status}>
          {asset}
        </ItemBold>
        <TargetReduction data-tn='eventScheduleRow-targetReduction' status={status}>
          {schedule.getReductionDisplay(targetReduction)}
        </TargetReduction>
        <RealTimeReduction data-tn='eventScheduleRow-realTimeReduction' status={status}>
          {schedule.getReductionDisplay(realTimeReduction)}
        </RealTimeReduction>
      </EventScheduleRowFlex>
      {settingPoints?.length && <SetPointsHeader />}
      {settingPoints?.map((setPoint, index) => (
        <SetPointRow
          key={setPoint.pointId || index}
          dispatchId={dispatchId}
          setPoint={setPoint}
          status={status!}
        />
      ))}
    </EventScheduleRowContainer>
  );
};

interface EventScheduleProps {
  schedule: EventScheduleModel[] | null;
}

export const EventSchedule: React.FC<EventScheduleProps> = ({ schedule }) => {
  if (!schedule || !schedule.length) {
    return null;
  }

  return (
    <EventScheduleContainer>
      <WrappedEventScheduleTitle size='large'>Event Schedule</WrappedEventScheduleTitle>
      <HeaderFlex justifyContent='space-between'>
        <HeaderText>Status</HeaderText>
        <HeaderText>Event</HeaderText>
        <HeaderText>Start Time</HeaderText>
        <HeaderText>End Time</HeaderText>
        <HeaderText>Asset</HeaderText>
        <HeaderText>Target Reduction</HeaderText>
        <HeaderText>Real-Time Reduction</HeaderText>
      </HeaderFlex>
      {schedule.map((schedule, index) => (
        <EventScheduleRow
          key={`${schedule.asset}-${index}`}
          schedule={schedule}
        />
      ))}
    </EventScheduleContainer>
  );
};

const SetPointRowFlex = styled(Flex)`
  height: 60px;
  background-color: ${colors.grayF4F6F8};
  padding: 19.5px;
  position: relative;

  :first-child {
    flex-basis: 11%;
  }

  :not(:last-of-type) {
    :after {
      position: absolute;
      content: '';
      width: calc(100% - 19.5px * 4);
      border-bottom: 1px solid ${colors.grayCBD4E2};
      bottom: 0;
      margin: 0 auto;
      z-index: 1;
    }
  }
`;

const StyledSetPointHeader = styled(Flex)`
  padding: 12px 19.5px 0 19.5px;
  background-color: ${colors.grayF4F6F8};
`;

const WrappedSetPointTitle = styled(Title)`
  font-size: 16px;
  color: ${colors.grayC1CEDF};
  flex-basis: calc(89% / 6);
`;

const SetPointItem = styled.span`
  :first-of-type {
    flex-basis: 11%;
  }

  :not(:first-of-type) {
    flex-basis: calc(89% / 6);
  }
`;

const SetPointAsset = styled(SetPointItem)`
  font-family: Soleil;
  font-size: 16px;
  font-weight: 350;
  color: ${colors.blue};
`;

const DefaultSetPointValue = styled(SetPointItem)`
  font-family: Soleil;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.blue};
`;

const EventSetPointValue = styled(DefaultSetPointValue)<{ status: string }>`
  color: ${({ status }) => {
    switch (status) {
      case 'Completed':
        return colors.grayCBD4E2;
      case 'In Action':
        return colors.green;
      case 'Next':
        return colors.yellow;
    }
  }};
`;

const WrappedIconRevert = styled.span<Pick<SetPoint, 'revertEnabled'>>`
  position: absolute;
  right: 24px;
  cursor: ${({ revertEnabled }) => revertEnabled ? 'pointer' : 'not-allowed'};
  z-index: 2;
  padding: 6px;
`;

const EventScheduleRowContainer = styled.div`
  border: 1px solid ${colors.grayEEF3FA};
  border-radius: 3px;
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.1);
  :not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const EventScheduleRowFlex = styled(Flex)`
  height: 60px;
  padding: 19.5px;
`;

const ItemText = styled.span<{
  status: typeof EventScheduleModel.prototype.status;
}>`
  position: relative;
  font-family: Soleil;
  font-size: 19px;
  font-weight: 350;
  color: ${colors.blue};
  opacity: ${({ status }) => (status == 'Completed' ? '30%' : '100%')};
  flex-basis: calc(89% / 6);
`;

const StartTime = styled(ItemText)`
  :after {
    position: absolute;
    right: 0;
    content: '→';
    font-family: Soleil;
    font-size: 13px;
    font-weight: 350px;
    color: ${colors.grayCBD4E2};
    line-height: 20px;
    right: 36px;
  }
`;

const ItemBold = styled(ItemText)`
  font-size: 16px;
  font-weight: 700;
`;

const TargetReduction = styled(ItemBold)`
  font-size: 19px;
`;

const RealTimeReduction = styled(TargetReduction)`
  ${({ status }) => {
    if (status === 'In Action') {
      return `color: ${colors.green};`;
    } else if (status === 'Next') {
      return `color: ${colors.yellow};`;
    }
  }}
`;

const ItemStatus = styled(ItemText)`
  color: ${({ status }) => {
    switch (status) {
      case 'Completed':
        return colors.grayCBD4E2;
      case 'In Action':
        return colors.green;
      case 'Next':
        return colors.yellow;
    }
  }};
  opacity: 100%;
  flex-basis: 11%;
`;

const EventScheduleContainer = styled.div`
  padding: 0 46px;
`;

const HeaderFlex = styled(Flex)`
  border-bottom: 1px solid ${colors.grayEEF3FA};
  padding: 0 19.5px 9px 19.5px;
  margin-bottom: 18.5px;
`;

const WrappedEventScheduleTitle = styled(Title)`
  margin-bottom: 50px;
`;

const HeaderText = styled(Title)`
  font-size: 16px;

  :first-of-type {
    flex-basis: 11%;
  }
  :not(:first-of-type) {
    flex-basis: calc(89% / 6);
  }
`;
