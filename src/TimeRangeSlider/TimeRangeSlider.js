import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Wireframe } from './Wireframe';

import './TimeRangeSlider.scss';

const MODE = {
  CONTROLLABLE: 'CONTROLLABLE',
  UNCONTROLLABLE: 'UNCONTROLLABLE',
};

const GRABBED_OBJECT = {
  NONE: 'NONE',
  FIRST_HANDLE: 'FIRST_HANDLE',
  SECOND_HANDLE: 'SECOND_HANDLE',
  SELECTED_RANGE: 'SELECTED_RANGE',
};

const POSITION_UNIT = 'px';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class TimeRangeSlider extends React.Component {
  static propTypes = {
    range: PropTypes.shape({
      startHour: PropTypes.number.isRequired,
      endHour: PropTypes.number.isRequired,
    }).isRequired,
    markStep: PropTypes.number,
    selectedRange: PropTypes.shape({
      startHour: PropTypes.number.isRequired,
      endHour: PropTypes.number.isRequired,
    }).isRequired,
    onSelectedRangeChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    markStep: 4,
    className: '',
  };

  static Wireframe = Wireframe;

  grabbedObject = GRABBED_OBJECT.NONE;

  state = {
    mode: MODE.CONTROLLABLE,
    startHandlePosition: null,
    endHandlePosition: null,
  };

  componentDidMount() {
    this.measureElementsSize();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.range !== this.props.range) {
      this.measureElementsSize();
    }
  }

  grabStartHandle = () => {
    this.grabbedObject = GRABBED_OBJECT.FIRST_HANDLE;
    this.grabObject();
  };

  grabEndHandle = () => {
    this.grabbedObject = GRABBED_OBJECT.SECOND_HANDLE;
    this.grabObject();
  };

  grabSelectedRange = () => {
    this.grabbedObject = GRABBED_OBJECT.SELECTED_RANGE;
    this.grabObject();
  };

  grabObject() {
    document.addEventListener('mousemove', this.moveObject);
    document.addEventListener('mouseup', this.releaseObject);
    this.switchToUncontrollableMode();
  }

  releaseObject = () => {
    document.removeEventListener('mousemove', this.moveObject);
    document.removeEventListener('mouseup', this.releaseObject);
    this.grabbedObject = GRABBED_OBJECT.NONE;
    this.switchToControllableMode();
  };

  switchToUncontrollableMode = () => {
    const { selectedRange } = this.props;
    this.setState({
      mode: MODE.UNCONTROLLABLE,
      startHandlePosition: this.toSliderPosition(selectedRange.startHour),
      endHandlePosition: this.toSliderPosition(selectedRange.endHour),
    });
  };

  switchToControllableMode = () => {
    this.setState({
      mode: MODE.CONTROLLABLE,
      startHandlePosition: null,
      endHandlePosition: null,
    });
  };

  moveObject = async ({ movementX }) => {
    let { startHandlePosition, endHandlePosition } = this.state;

    switch (this.grabbedObject) {
      case GRABBED_OBJECT.FIRST_HANDLE: {
        startHandlePosition = clamp(
          startHandlePosition + movementX,
          -this.SLIDER_HANDLE_HALF_WIDTH,
          this.SLIDER_WIDTH - this.SLIDER_HANDLE_HALF_WIDTH,
        );
        break;
      }
      case GRABBED_OBJECT.SECOND_HANDLE: {
        endHandlePosition = clamp(
          endHandlePosition + movementX,
          -this.SLIDER_HANDLE_HALF_WIDTH,
          this.SLIDER_WIDTH - this.SLIDER_HANDLE_HALF_WIDTH,
        );
        break;
      }
      case GRABBED_OBJECT.SELECTED_RANGE: {
        const selectedRangeLeftMin = -this.SLIDER_HANDLE_HALF_WIDTH;
        const selectedRangeRightMax =
          this.SLIDER_WIDTH - this.SLIDER_HANDLE_HALF_WIDTH;
        if (
          startHandlePosition + movementX >= selectedRangeLeftMin &&
          endHandlePosition + movementX <= selectedRangeRightMax
        ) {
          startHandlePosition += movementX;
          endHandlePosition += movementX;
        }
        break;
      }
    }

    // TODO: this situation can happen only when grabbed object is handle
    //  (redundant check in case of grabbed object is selected range)
    //  but this way is more readable (is it good decision?)
    const handlesCrossed = startHandlePosition > endHandlePosition;
    if (handlesCrossed) {
      [startHandlePosition, endHandlePosition] = [
        endHandlePosition,
        startHandlePosition,
      ];
      this.grabbedObject =
        this.grabbedObject === GRABBED_OBJECT.FIRST_HANDLE
          ? GRABBED_OBJECT.SECOND_HANDLE
          : GRABBED_OBJECT.FIRST_HANDLE;
    }

    this.setState({ startHandlePosition, endHandlePosition });

    const newSelectedRange = {
      startHour: Math.round(this.toHour(startHandlePosition)),
      endHour: Math.round(this.toHour(endHandlePosition)),
    };
    const { onSelectedRangeChange } = this.props;
    onSelectedRangeChange(newSelectedRange);
  };

  toHour = sliderPosition => {
    const { range } = this.props;
    const offsetFromStartInHours = sliderPosition / this.HOUR_WIDTH;
    return range.startHour + offsetFromStartInHours;
  };

  toSliderPosition = hour => {
    const { range } = this.props;
    const offsetFromStartHour = hour - range.startHour;
    return offsetFromStartHour * this.HOUR_WIDTH;
  };

  measureElementsSize() {
    this.SLIDER_WIDTH = this.slider.offsetWidth;

    const { range } = this.props;
    const hoursCount = range.endHour - range.startHour;
    this.HOUR_WIDTH = this.SLIDER_WIDTH / hoursCount;

    this.SLIDER_HANDLE_HALF_WIDTH = this.handle.offsetWidth / 2;
  }

  calculateHandlesPositionsFromProps() {
    const { selectedRange } = this.props;
    const startHandlePosition = this.toSliderPosition(selectedRange.startHour);
    const endHandlePosition = this.toSliderPosition(selectedRange.endHour);
    return [startHandlePosition, endHandlePosition];
  }

  calculateHandlesPositionsFromState() {
    const { startHandlePosition, endHandlePosition } = this.state;
    return [startHandlePosition, endHandlePosition];
  }

  setSliderRef = slider => (this.slider = slider);

  setHandleRef = handle => (this.handle = handle);

  render() {
    const { range, selectedRange, markStep, className } = this.props;
    const { mode } = this.state;

    const [startHandlePosition, endHandlePosition] =
      mode === MODE.CONTROLLABLE
        ? this.calculateHandlesPositionsFromProps()
        : this.calculateHandlesPositionsFromState();

    const selectedRangePosition = startHandlePosition;
    this.selectedRangeLength = Math.round(
      endHandlePosition - startHandlePosition,
    );

    return (
      <div ref={this.setSliderRef} className={classNames('slider', className)}>
        <div
          className='slider-handle'
          ref={this.setHandleRef}
          style={{ left: startHandlePosition + POSITION_UNIT }}
          onMouseDown={this.grabStartHandle}
        />
        <div
          className='slider-handle'
          style={{ left: endHandlePosition + POSITION_UNIT }}
          onMouseDown={this.grabEndHandle}
        />
        <div
          className='selected-range'
          style={{
            left: selectedRangePosition + POSITION_UNIT,
            width: this.selectedRangeLength + POSITION_UNIT,
          }}
          onMouseDown={this.grabSelectedRange}
        />
        <TimeRangeSlider.Wireframe
          markStep={markStep}
          range={range}
          selectedRange={selectedRange}
        />
      </div>
    );
  }
}

export default TimeRangeSlider;
