import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import Draggable, { DraggableProps } from 'react-draggable';

import { colors, Flex } from 'design-system';
import { RootState } from 'store';
import { setTime } from 'store/time';
import { parseTime, getHourMinuteTickIndex, hourMinuteTicks } from 'utils';

interface OwnProps {
  className?: string;
}

interface OwnState {
  isPastTime: boolean;
  tooltipDisplay: string;
  xPosition: number | null;
}

interface StoreStateProps {
  date: Date;
}

interface StoreDispatchProps {
  setTime: (date: Date) => void;
}

type SliderProps = OwnProps & StoreStateProps & StoreDispatchProps;

export class SliderComponent extends Component<SliderProps, OwnState> {
  containerRef = React.createRef<HTMLDivElement>();
  state = {
    tooltipDisplay: '',
    isPastTime: false,
    xPosition: null,
  };

  componentDidMount() {
    this.setXPositionFromTime();
    const tickIndex = getHourMinuteTickIndex(this.props.date);
    this.setSliderTooltipDisplay(tickIndex);
  }

  componentDidUpdate(prevProps: SliderProps) {
    if (prevProps.date !== this.props.date) {
      this.setXPositionFromTime();
      const tickIndex = getHourMinuteTickIndex(this.props.date);
      this.setSliderTooltipDisplay(tickIndex);
    }

    if (typeof this.state.xPosition === 'number') {
      this.setState({ xPosition: null });
    }
  }

  setXPositionFromTime(): void {
    if (this.containerRef.current === undefined) {
      return;
    }

    const rangeIndex = getHourMinuteTickIndex(this.props.date);
    // Compensate for the tooltip's width
    const containerWidth = this.containerRef!.current!.offsetWidth - 45;
    const widthIncrement = containerWidth / 96;
    // The center of the container according to draggable coordinates is 0, 0.
    // Going left of this results in -x, 0 and right of this results in +x, 0.
    let xPosition = 0;
    for (let i = -47, n = 0; n <= rangeIndex; i += 1, n += 1) {
      xPosition = i * widthIncrement - 6;
    }

    this.setState({ xPosition });
  }

  setSliderTooltipDisplay(rangeIndex: number): void {
    const rangeIndexNow = getHourMinuteTickIndex(new Date());
    const parsedDate = new Date();
    parsedDate.setHours(
      parseInt(hourMinuteTicks[rangeIndex].substring(0, 2), 10),
    );
    parsedDate.setMinutes(
      parseInt(hourMinuteTicks[rangeIndex].substring(2, 5), 10),
    );
    const [hourString, minuteString, AMPM] = parseTime(parsedDate);

    if (rangeIndex < rangeIndexNow) {
      this.setState({
        isPastTime: true,
        tooltipDisplay: `${hourString}:${minuteString} ${AMPM}`,
      });
    } else if (rangeIndex === rangeIndexNow) {
      this.setState({
        isPastTime: false,
        tooltipDisplay: 'Now',
      });
    } else {
      this.setState({
        isPastTime: false,
        tooltipDisplay: `${hourString}:${minuteString} ${AMPM}`,
      });
    }
  }

  handleOnStop = (lastX: number, shouldSetTime: boolean) => {
    if (this.containerRef.current === undefined) {
      return;
    }
    // Compensate for the tooltip's width
    const containerWidth = this.containerRef!.current!.offsetWidth - 40;
    const widthIncrement = containerWidth / 96;
    // The center of the container according to draggable coordinates is 0, 0.
    // Going left of this results in -x, 0 and right of this results in +x, 0.
    let hourMinuteTickIndex = 0;
    for (let i = -47; i <= 47; i += 1, hourMinuteTickIndex += 1) {
      if (widthIncrement * i >= lastX) {
        break;
      }
    }

    const tick = hourMinuteTicks[hourMinuteTickIndex];
    const updatedDate = new Date(this.props.date);
    const hour = parseInt(tick.substring(0, 2), 10);
    const minute = parseInt(tick.substring(2, 4), 10);
    updatedDate.setHours(hour);
    updatedDate.setMinutes(minute);
    if (shouldSetTime) {
      this.props.setTime(updatedDate);
    }
    this.setSliderTooltipDisplay(hourMinuteTickIndex);
  };

  render() {
    const { className } = this.props;
    const { isPastTime, tooltipDisplay, xPosition } = this.state;

    // HACK: When we receive a different date from Redux, we temporarily set
    // Draggable.position to set its own managed state. That way, when we drag
    // afterwards, we drag from that position instead of the previous position
    const draggableProps: Partial<DraggableProps> = {};
    if (xPosition !== null) {
      draggableProps.position = { x: xPosition!, y: 0 };
    }

    return (
      <SliderContainer
        forwardRef={this.containerRef}
        className={className}
        justifyContent="center"
      >
        <Draggable
          axis="x"
          bounds="parent"
          onStop={(e, data) => this.handleOnStop(data.lastX, true)}
          onDrag={(e, data) => this.handleOnStop(data.lastX, false)}
          {...draggableProps}
        >
          <SliderTooltip display={tooltipDisplay} isPastTime={isPastTime}>
            {tooltipDisplay}
          </SliderTooltip>
        </Draggable>
      </SliderContainer>
    );
  }
}

// The width and margin-left are magic numbers because we can only drag left
// as far as the SliderTooltip will stay inside the bounds. These numbers allow
// dragging all the left so that the SliderTooltip ends up directly between
// 12:00 & 12:15AM. All the way right lines up with the right graph border.
const SliderContainer = styled(Flex)`
  width: calc(100% - 41px);
  position: absolute;
  z-index: 2;
  top: 41px;
  margin-left: 28.5px;
`;

const SliderTooltip = styled.span<{ display: string; isPastTime: boolean }>`
  display: block;
  position: relative;
  width: 64px;
  height: 24px;
  text-align: center;
  line-height: 25px;
  font-size: 12px;
  font-family: Aktiv Grotesk;
  font-weight: 500;
  background-color: ${({ isPastTime }) =>
    isPastTime ? colors.lightBlue : colors.blue};
  color: ${colors.white};
  box-shadow: 0 2px 5px 0 rgba(87, 94, 104, 0.3);
  border-radius: 12.5px;
  cursor: pointer;

  :before {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 8px;
    left: calc(50% - 3.5px);
    top: 556px;
    border-radius: 10px;
    background-color: ${colors.grayCBD4E2};
  }

  :after {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 538px;
    left: 50%;
    background-color: ${colors.grayCBD4E2};
  }
`;

const mapStateToProps = (state: RootState): StoreStateProps => ({
  date: state.time.instance,
});

const mapDispatchToProps = (dispatch: any): StoreDispatchProps => ({
  setTime: debounce((date: Date) => dispatch(setTime(date)), 500),
});

export const Slider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SliderComponent);
