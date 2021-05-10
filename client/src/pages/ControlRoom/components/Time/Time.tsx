// TODO: Write tests
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { TimeDropdown, OnSelectCallback } from './TimeDropdown';
import {
  colors,
  Flex,
  Title,
  IconDropdownArrow,
  IconTime,
} from 'design-system';
import { RootState } from 'store';
import { setTime } from 'store/time';
import { parseTime, getHourMinuteTickIndex } from 'utils';

interface TimeProps {
  className?: string;
}

export const Time: React.FC<TimeProps> = ({ className }) => {
  const dispatch = useDispatch();
  const date = useSelector((state: RootState) => state.time.instance);
  const hourMinuteTickIndex = getHourMinuteTickIndex(date);
  const hourMinuteTickIndexNow = getHourMinuteTickIndex(new Date());
  let isPast: boolean;
  if (hourMinuteTickIndex < hourMinuteTickIndexNow) {
    isPast = true;
  } else {
    isPast = false;
  }

  const [isTimeDropdownShown, showTimeDropdown] = useState(false);
  const [hours, minutes, AMPM] = parseTime(date);

  const onSelect: OnSelectCallback = selectedDate => {
    // The selected date will default to today's date. Preserve year, month,
    // and day and only change hour/minute
    const year = date.getFullYear();
    const month = date.getMonth();
    const newDate = date.getDate();
    const hour = selectedDate.getHours();
    const minute = selectedDate.getMinutes();
    dispatch(setTime(new Date(year, month, newDate, hour, minute)));
    showTimeDropdown(false);
  };

  return (
    <TimeContainer className={className}>
      <Flex
        data-tn="time-toggle-dropdown"
        style={{ cursor: 'pointer', height: 'inherit' }}
        flexDirection="column"
        justifyContent="space-between"
        onClick={() => showTimeDropdown(!isTimeDropdownShown)}
      >
        <TimeHeader>Time</TimeHeader>
        <TimeDisplay
          isPast={isPast}
          data-tn="time-hour-minute"
        >{`${hours}:${minutes}`}</TimeDisplay>
        <Flex alignItems="center">
          <IconTime
            color={isPast ? colors.lightBlue : colors.blue}
            css="margin-right: 4px;"
          />
          <AMPMDisplay isPast={isPast} data-tn="time-am-pm">
            {AMPM}
          </AMPMDisplay>
          <IconDropdownArrow css="margin-bottom: 4px;" color={colors.blue} />
        </Flex>
      </Flex>
      {isTimeDropdownShown && (
        <TimeDropdown
          date={date}
          close={() => showTimeDropdown(false)}
          onSelect={onSelect}
        />
      )}
    </TimeContainer>
  );
};

const TimeContainer = styled.div`
  height: 91px;
  padding: 0px 37.5px 0px 19.5px;
  position: relative;
`;

const TimeHeader = styled(Title)`
  flex-basis: 38%;
`;

const TimeDisplay = styled.span<{ isPast: boolean }>`
  font-family: Aktiv Grotesk;
  font-size: 31px;
  font-weight: 500;
  color: ${({ isPast }) => (isPast ? colors.lightBlue : colors.blue)};
`;

const AMPMDisplay = styled.span<{ isPast: boolean }>`
  font-family: Aktiv Grotesk;
  font-size: 13px;
  font-weight: 500;
  color: ${({ isPast }) => (isPast ? colors.lightBlue : colors.blue)};
  margin-right: 8px;
`;
