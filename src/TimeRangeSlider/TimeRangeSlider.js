import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { SliderWireframe } from './SliderWireframe';

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

const CSS_UNIT = 'px';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class TimeRangeSlider extends React.Component {
  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    minutesPerTimeUnit: PropTypes.number.isRequired,
    selectedRange: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    formatLabel: PropTypes.func.isRequired,
    labelMarkStep: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    labelMarkStep: 4,
    className: '',
  };

  grabbedObject = {
    type: GRABBED_OBJECT.NONE,
    cursorShiftX: null,
  };

  state = {
    mode: MODE.CONTROLLABLE,
    startHandlePosition: null,
    endHandlePosition: null,
    timeUnitWidth: null,
  };

  componentDidMount() {
    this.measureElementsSize();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !_.isEqual(nextState, this.state);
    const propsChanged = !_.isEqual(nextState, this.props);

    const { mode } = this.state;
    return stateChanged || (propsChanged && mode !== MODE.UNCONTROLLABLE);
  }

  handleResize = () => {
    this.measureElementsSize();
  };

  grabStartHandle = event => {
    this.grabbedObject.type = GRABBED_OBJECT.FIRST_HANDLE;
    this.grabObject(event);
  };

  grabEndHandle = event => {
    this.grabbedObject.type = GRABBED_OBJECT.SECOND_HANDLE;
    this.grabObject(event);
  };

  grabSelectedRange = event => {
    this.grabbedObject.type = GRABBED_OBJECT.SELECTED_RANGE;
    this.grabObject(event);
  };

  grabObject({ target: grabbedObject, pageX: cursorX }) {
    const grabbedObjectLeft = grabbedObject.getBoundingClientRect().left;
    this.grabbedObject.cursorShiftX = cursorX - grabbedObjectLeft;

    document.addEventListener('mousemove', this.moveObject);
    document.addEventListener('mouseup', this.releaseObject);

    this.switchToUncontrollableMode();
  }

  releaseObject = () => {
    document.removeEventListener('mousemove', this.moveObject);
    document.removeEventListener('mouseup', this.releaseObject);
    this.grabbedObject.type = GRABBED_OBJECT.NONE;
    this.animateSelectedRangeRounding();
    this.switchToControllableMode();
  };

  animateSelectedRangeRounding() {
    this.selectedRange.classList.add('smooth-position-transition');
    this.startHandle.classList.add('smooth-position-transition');
    this.endHandle.classList.add('smooth-position-transition');

    setTimeout(this.finishSelectedRangeRoundingAnimation, 3000);
  }

  finishSelectedRangeRoundingAnimation = () => {
    this.selectedRange.classList.remove('smooth-position-transition');
    this.startHandle.classList.remove('smooth-position-transition');
    this.endHandle.classList.remove('smooth-position-transition');
  };

  switchToUncontrollableMode() {
    const { selectedRange } = this.props;
    this.setState({
      mode: MODE.UNCONTROLLABLE,
      startHandlePosition: this.minutesToSliderPosition(selectedRange.start),
      endHandlePosition: this.minutesToSliderPosition(selectedRange.end),
    });
  }

  switchToControllableMode() {
    this.setState({
      mode: MODE.CONTROLLABLE,
      startHandlePosition: null,
      endHandlePosition: null,
    });
  }

  moveObject = ({ pageX: cursorPagePosition }) => {
    const newPosition =
      this.pageToSliderPosition(cursorPagePosition) - this.grabbedObject.cursorShiftX;

    const { startHandlePosition, endHandlePosition } = this.state;
    let newStartHandlePosition, newEndHandlePosition;

    switch (this.grabbedObject.type) {
      case GRABBED_OBJECT.FIRST_HANDLE: {
        const minHandlePos = -this.handleWidth / 2;
        const maxHandlePos = this.sliderWidth - this.handleWidth / 2;

        newStartHandlePosition = clamp(newPosition, minHandlePos, maxHandlePos);
        newEndHandlePosition = endHandlePosition;

        [newStartHandlePosition, newEndHandlePosition] = this.swapHandlesIfCrossed(
          newStartHandlePosition,
          newEndHandlePosition,
        );
        break;
      }
      case GRABBED_OBJECT.SECOND_HANDLE: {
        const minHandlePos = -this.handleWidth / 2;
        const maxHandlePos = this.sliderWidth - this.handleWidth / 2;

        newEndHandlePosition = clamp(newPosition, minHandlePos, maxHandlePos);
        newStartHandlePosition = startHandlePosition;

        [newStartHandlePosition, newEndHandlePosition] = this.swapHandlesIfCrossed(
          newStartHandlePosition,
          newEndHandlePosition,
        );
        break;
      }
      case GRABBED_OBJECT.SELECTED_RANGE: {
        const minSelectedRangePos = -this.handleWidth / 2;
        const maxSelectedRangePos = this.sliderWidth - this.selectedRangeLength;

        const newSelectedRangeStartPosition = clamp(
          newPosition,
          minSelectedRangePos,
          maxSelectedRangePos,
        );
        newStartHandlePosition = newSelectedRangeStartPosition;
        newEndHandlePosition = newSelectedRangeStartPosition + this.selectedRangeLength;
        break;
      }
    }

    this.handleHandlesPositionsChange(newStartHandlePosition, newEndHandlePosition);
  };

  pageToSliderPosition(pagePosition) {
    return pagePosition - this.sliderPageLeftOffset;
  }

  swapHandlesIfCrossed(startHandlePosition, endHandlePosition) {
    if (startHandlePosition > endHandlePosition) {
      [startHandlePosition, endHandlePosition] = [endHandlePosition, startHandlePosition];

      this.grabbedObject.type =
        this.grabbedObject.type === GRABBED_OBJECT.FIRST_HANDLE
          ? GRABBED_OBJECT.SECOND_HANDLE
          : GRABBED_OBJECT.FIRST_HANDLE;
    }
    return [startHandlePosition, endHandlePosition];
  }

  handleHandlesPositionsChange(newStartHandlePosition, newEndHandlePosition) {
    const {
      startHandlePosition: lastStartHandlePosition,
      endHandlePosition: lastEndHandlePosition,
    } = this.state;

    if (
      newStartHandlePosition !== lastStartHandlePosition ||
      newEndHandlePosition !== lastEndHandlePosition
    ) {
      this.setState({
        startHandlePosition: newStartHandlePosition,
        endHandlePosition: newEndHandlePosition,
      });

      const newSelectedRange = {
        start: this.positionToMinutes(newStartHandlePosition),
        end: this.positionToMinutes(newEndHandlePosition),
      };
      const { onChange } = this.props;
      onChange(newSelectedRange);
    }
  }

  positionToTimeUnit(sliderPosition) {
    const { timeUnitWidth } = this.state;
    return Math.round(sliderPosition / timeUnitWidth);
  }

  positionToMinutes(sliderPosition) {
    const { min, minutesPerTimeUnit } = this.props;
    const timeUnit = this.positionToTimeUnit(sliderPosition);
    return min + timeUnit * minutesPerTimeUnit;
  }

  minutesToSliderPosition(minutes) {
    const { min, minutesPerTimeUnit } = this.props;
    const { timeUnitWidth } = this.state;
    const offsetFromStartInMinutes = minutes - min;
    const offsetFromStartInTimeUnits = offsetFromStartInMinutes / minutesPerTimeUnit;
    return offsetFromStartInTimeUnits * timeUnitWidth - this.handleWidth / 2;
  }

  measureElementsSize() {
    const { width, left } = this.slider.getBoundingClientRect();
    this.sliderWidth = width;
    this.sliderPageLeftOffset = left;

    const { min, max, minutesPerTimeUnit } = this.props;
    const timeUnitsCount = (max - min) / minutesPerTimeUnit;

    // timeUnitWidth change should trigger rerender to recalculate slider handles positions
    this.setState({ timeUnitWidth: this.sliderWidth / timeUnitsCount });

    this.handleWidth = this.startHandle.getBoundingClientRect().width;
  }

  setSliderRef = slider => (this.slider = slider);

  setSelectedRangeRef = selectedRange => (this.selectedRange = selectedRange);

  setStartHandleRef = handle => (this.startHandle = handle);

  setEndHandleRef = handle => (this.endHandle = handle);

  getHandlesPositionsFromProps() {
    const { selectedRange } = this.props;
    const startHandlePosition = this.minutesToSliderPosition(selectedRange.start);
    const endHandlePosition = this.minutesToSliderPosition(selectedRange.end);
    return [startHandlePosition, endHandlePosition];
  }

  getHandlesPositionsFromState() {
    const { startHandlePosition, endHandlePosition } = this.state;
    return [startHandlePosition, endHandlePosition];
  }

  render() {
    const {
      min,
      max,
      selectedRange,
      minutesPerTimeUnit,
      formatLabel,
      labelMarkStep,
      className,
    } = this.props;

    const { mode } = this.state;

    const [startHandlePosition, endHandlePosition] =
      mode === MODE.CONTROLLABLE
        ? this.getHandlesPositionsFromProps()
        : this.getHandlesPositionsFromState();

    const selectedRangePosition = startHandlePosition;
    this.selectedRangeLength = endHandlePosition - startHandlePosition;

    return (
      <div ref={this.setSliderRef} className={classNames('slider-box', className)}>
        <div
          className='slider-handle'
          ref={this.setStartHandleRef}
          style={{
            left: startHandlePosition + CSS_UNIT,
          }}
          onMouseDown={this.grabStartHandle}
        />
        <div
          className='slider-handle'
          ref={this.setEndHandleRef}
          style={{
            left: endHandlePosition + CSS_UNIT,
          }}
          onMouseDown={this.grabEndHandle}
        />
        <div
          ref={this.setSelectedRangeRef}
          className='selected-range'
          style={{
            left: selectedRangePosition + CSS_UNIT,
            width: this.selectedRangeLength + CSS_UNIT,
          }}
          onMouseDown={this.grabSelectedRange}
        />
        <SliderWireframe
          min={min}
          max={max}
          labelMarkStep={labelMarkStep}
          minutesPerTimeUnit={minutesPerTimeUnit}
          selectedRange={selectedRange}
          formatLabel={formatLabel}
        />
      </div>
    );
  }
}

export default TimeRangeSlider;
