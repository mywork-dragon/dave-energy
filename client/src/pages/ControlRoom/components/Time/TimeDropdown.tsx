// TODO: Write tests

import React, { Component, createRef } from 'react';
import styled, { css } from 'styled-components';

import { parseTime } from 'utils';
import { colors, Flex } from 'design-system';

export type OnSelectCallback = (date: Date) => void;

interface TimeDropdownProps {
  className?: string;
  close?: () => void;
  date: Date;
  onSelect?: OnSelectCallback;
}

export class TimeDropdown extends Component<TimeDropdownProps> {
  ref = createRef<HTMLUListElement>();

  private handleOnClick = (e: any) => {
    if (!this.ref?.current?.contains(e.target)) {
      this.props?.close?.();
    }
  };

  public componentDidMount() {
    document.addEventListener('click', this.handleOnClick);
    // Scroll down the container so that the current time is viewiable at the
    // bottom
    const nowTimeInterval = this.ref.current?.querySelector(
      '[data-tn="time-dropdown-tick-now"]',
    ) as HTMLDivElement;
    const containerHeight = 488;
    this.ref!.current!.scrollTop = nowTimeInterval.offsetTop - containerHeight;
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleOnClick);
  }

  public render(): JSX.Element {
    const { className, date, onSelect } = this.props;
    return (
      <TimeDropdownContainer
        data-tn="time-dropdown"
        ref={this.ref}
        className={className}
      >
        <TimeIntervals date={date} onSelect={onSelect} />
      </TimeDropdownContainer>
    );
  }
}

const TimeDropdownContainer = styled.ul`
  width: 203px;
  height: 520px;
  position: absolute;
  z-index: 1001;
  top: -15px;
  left: -27px;
  background-color: ${colors.white};
  padding-top: 12px;
  box-sizing: content-box;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
    0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
  overflow-y: scroll;
`;

const TimeIntervals = ({
  date,
  onSelect,
}: Pick<TimeDropdownProps, 'date' | 'onSelect'>) => {
  const dateInterval = new Date();
  dateInterval.setHours(0);
  dateInterval.setMinutes(0);
  const fifteenMinuteTicks = [];
  const tomorrow = new Date(dateInterval);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(0);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const now = new Date();
  const isPastDate = date.getDate() < now.getDate();

  let hasNowDate = false;
  while (dateInterval.getTime() <= tomorrow.getTime()) {
    const [hours, minutes, AMPM] = parseTime(dateInterval);
    const fifteenMinuteTick = new Date(dateInterval);
    const display = `${hours}:${minutes} ${AMPM}`;
    const isFutureDate = !isPastDate && fifteenMinuteTick > now;
    // TODO: Create a utility function that takes a Date and returns a HHMM
    // string
    const isNowDate =
      `${fifteenMinuteTick
        .getHours()
        .toString()
        .padStart(2, '0')}${fifteenMinuteTick
        .getMinutes()
        .toString()
        .padStart(2, '0')}` >
      `${now
        .getHours()
        .toString()
        .padStart(2, '0')}${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    const baseTimeIntervalProps = {
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
    };

    // Push a <TimeInterval /> for now
    if (isNowDate && !hasNowDate) {
      const [nowHours, nowMinutes, nowAMPM] = parseTime(now);
      const nowDisplay = `${nowHours}:${nowMinutes} ${nowAMPM}`;
      const nowTimeIntervalProps = {
        ...baseTimeIntervalProps,
        isNowDate: true,
        key: `${nowDisplay}-now`,
        onClick: () => onSelect?.(now),
        'data-tn': 'time-dropdown-tick-now',
      };
      fifteenMinuteTicks.push(
        <TimeInterval {...nowTimeIntervalProps}>
          {nowDisplay}
          <span>Now</span>
        </TimeInterval>,
      );
      hasNowDate = true;
    }

    // Add a divider between the 45 and 00 ticks, except for the last hour
    const hasDivider =
      fifteenMinuteTick.getMinutes() === 45 &&
      fifteenMinuteTick.getHours() !== 23;

    const timeIntervalProps = {
      ...baseTimeIntervalProps,
      hasDivider,
      isFutureDate,
      key: display,
      onClick: isFutureDate ? () => {} : () => onSelect?.(fifteenMinuteTick),
      'data-tn': 'time-dropdown-tick',
    };

    // Push a <TimeInteval /> that is a 15 minute tick
    fifteenMinuteTicks.push(
      <TimeInterval {...timeIntervalProps}>{display}</TimeInterval>,
    );

    dateInterval.setMinutes(dateInterval.getMinutes() + 15);
  }

  // Remove the extra midnight
  fifteenMinuteTicks.pop();

  return <>{fifteenMinuteTicks}</>;
};

const TimeInterval = styled(Flex)<{
  hasDivider?: boolean;
  isFutureDate?: boolean;
  isNowDate?: boolean;
}>`
  font-family: Aktiv Grotesk;
  font-size: 15px;
  font-weight: 500;
  color: ${({ isFutureDate }) =>
    isFutureDate ? colors.grayCBD4E2 : colors.blue};
  width: 152px;
  height: 40px;
  margin: 0 auto;
  padding: 4px 18px 0 18px;
  cursor: ${({ isFutureDate }) => (isFutureDate ? 'default' : 'pointer')};
  border-radius: 20px;
  position: relative;

  :last-of-type {
    margin-bottom: 20px;
  }

  ${({ isFutureDate }) =>
    !isFutureDate &&
    css`
      :hover {
        background-color: ${colors.grayEEF3FA};
      }
    `}

  ${({ isNowDate }) =>
    isNowDate &&
    css`
      color: ${colors.white};
      background-color: ${colors.green};
      :hover {
        background-color: ${colors.green};
      }
    `}

  ${({ hasDivider }) =>
    hasDivider &&
    css`
      :after {
        content: '';
        position: absolute;
        width: 100%;
        border-bottom: 1px solid ${colors.grayEEF3FA};
        bottom: 0;
        right: 0;
      }
    `}
`;
