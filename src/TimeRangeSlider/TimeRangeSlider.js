import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

const POSITION_UNIT = 'px';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class TimeRangeSlider extends React.PureComponent {
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

  grabbedObject = {
    type: GRABBED_OBJECT.NONE,
  };

  state = {
    mode: MODE.CONTROLLABLE,
    startHandlePosition: null,
    endHandlePosition: null,
    hourWidth: null,
  };

  componentDidMount() {
    this.measureElementsSize();
    this.calculateSliderElementsPositionsLimits();
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.measureElementsSize();
    this.calculateSliderElementsPositionsLimits();
  }

  handleResize = () => {
    this.measureElementsSize();
    this.calculateSliderElementsPositionsLimits();
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

  grabObject({ target: grabbedObject, pageX: cursorPosition }) {
    const grabbedObjectLeft = grabbedObject.getBoundingClientRect().left;
    this.grabbedObject.cursorShiftX = grabbedObjectLeft - cursorPosition;

    document.addEventListener('mousemove', this.moveObject);
    document.addEventListener('mouseup', this.releaseObject);

    this.removeSmoothHoursRoundingAnimation();
    this.switchToUncontrollableMode();
  }

  releaseObject = () => {
    document.removeEventListener('mousemove', this.moveObject);
    document.removeEventListener('mouseup', this.releaseObject);
    this.grabbedObject.type = GRABBED_OBJECT.NONE;
    this.addSmoothHoursRoundingAnimation();
    this.switchToControllableMode();
  };

  addSmoothHoursRoundingAnimation() {
    this.selectedRange.style.transition = 'left 0.3s ease-out, width 0.3s ease-out';
    this.startHandle.style.transition = 'left 0.3s ease-out';
    this.endHandle.style.transition = 'left 0.3s ease-out';
  }

  removeSmoothHoursRoundingAnimation() {
    this.selectedRange.style.transition = '';
    this.startHandle.style.transition = '';
    this.endHandle.style.transition = '';
  }

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

  pageToSliderPosition(pagePosition) {
    return pagePosition - this.sliderPageLeftOffset;
  }

  moveObject = ({ pageX: cursorPagePosition }) => {
    const newPosition =
      this.pageToSliderPosition(cursorPagePosition) + this.grabbedObject.cursorShiftX;

    const { startHandlePosition, endHandlePosition } = this.state;
    let newStartHandlePosition, newEndHandlePosition;

    switch (this.grabbedObject.type) {
      case GRABBED_OBJECT.FIRST_HANDLE: {
        newStartHandlePosition = clamp(newPosition, this.minHandlePos, this.maxHandlePos);
        newEndHandlePosition = endHandlePosition;

        [newStartHandlePosition, newEndHandlePosition] = this.swapHandlersIfCrossed(
          newStartHandlePosition,
          newEndHandlePosition,
        );
        break;
      }
      case GRABBED_OBJECT.SECOND_HANDLE: {
        newEndHandlePosition = clamp(newPosition, this.minHandlePos, this.maxHandlePos);
        newStartHandlePosition = startHandlePosition;

        [newStartHandlePosition, newEndHandlePosition] = this.swapHandlersIfCrossed(
          newStartHandlePosition,
          newEndHandlePosition,
        );
        break;
      }
      case GRABBED_OBJECT.SELECTED_RANGE: {
        const newSelectedRangeStartPosition = clamp(
          newPosition,
          this.minSelectedRangePos,
          this.maxSelectedRangePos,
        );
        newStartHandlePosition = newSelectedRangeStartPosition;
        newEndHandlePosition = newSelectedRangeStartPosition + this.selectedRangeLength;
        break;
      }
    }

    this.handleHandlesPositionsChange(newStartHandlePosition, newEndHandlePosition);
  };

  swapHandlersIfCrossed(startHandlePosition, endHandlePosition) {
    if (startHandlePosition > endHandlePosition) {
      [startHandlePosition, endHandlePosition] = [endHandlePosition, startHandlePosition];

      this.grabbedObject =
        this.grabbedObject === GRABBED_OBJECT.FIRST_HANDLE
          ? GRABBED_OBJECT.SECOND_HANDLE
          : GRABBED_OBJECT.FIRST_HANDLE;
    }
    return [startHandlePosition, endHandlePosition];
  }

  handleHandlesPositionsChange = (newStartHandlePosition, newEndHandlePosition) => {
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
        startHour: Math.round(this.toHour(newStartHandlePosition)),
        endHour: Math.round(this.toHour(newEndHandlePosition)),
      };
      const { onSelectedRangeChange } = this.props;
      onSelectedRangeChange(newSelectedRange);
    }
  };

  toHour = sliderPosition => {
    const { range } = this.props;
    const { hourWidth } = this.state;
    const offsetFromStartInHours = sliderPosition / hourWidth;
    return range.startHour + offsetFromStartInHours;
  };

  toSliderPosition = hour => {
    const { range } = this.props;
    const { hourWidth } = this.state;
    const offsetFromStartHour = hour - range.startHour;
    return offsetFromStartHour * hourWidth;
  };

  calculateSliderElementsPositionsLimits() {
    this.minHandlePos = -this.handleWidth / 2;
    this.maxHandlePos = this.sliderWidth - this.handleWidth / 2;
    this.minSelectedRangePos = this.minHandlePos;
    this.maxSelectedRangePos = this.sliderWidth - this.selectedRangeLength;
  }

  measureElementsSize() {
    const { width, left } = this.slider.getBoundingClientRect();
    this.sliderWidth = width;
    this.sliderPageLeftOffset = left;

    const { range } = this.props;
    const hoursCount = range.endHour - range.startHour;
    this.setState({ hourWidth: this.sliderWidth / hoursCount });

    this.handleWidth = this.startHandle.getBoundingClientRect().width;
  }

  setSliderRef = slider => (this.slider = slider);

  setSelectedRangeRef = selectedRange => (this.selectedRange = selectedRange);

  setStartHandleRef = handle => (this.startHandle = handle);

  setEndHandleRef = handle => (this.endHandle = handle);

  getHandlesPositionsFromProps() {
    const { selectedRange } = this.props;
    const startHandlePosition = this.toSliderPosition(selectedRange.startHour);
    const endHandlePosition = this.toSliderPosition(selectedRange.endHour);
    return [startHandlePosition, endHandlePosition];
  }

  getHandlesPositionsFromState() {
    const { startHandlePosition, endHandlePosition } = this.state;
    return [startHandlePosition, endHandlePosition];
  }

  render() {
    const { range, selectedRange, markStep, className } = this.props;
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
            left: startHandlePosition + POSITION_UNIT,
          }}
          onMouseDown={this.grabStartHandle}
        />
        <div
          className='slider-handle'
          ref={this.setEndHandleRef}
          style={{
            left: endHandlePosition + POSITION_UNIT,
          }}
          onMouseDown={this.grabEndHandle}
        />
        <div
          ref={this.setSelectedRangeRef}
          className='selected-range'
          style={{
            left: selectedRangePosition + POSITION_UNIT,
            width: this.selectedRangeLength + POSITION_UNIT,
          }}
          onMouseDown={this.grabSelectedRange}
        />
        <SliderWireframe markStep={markStep} range={range} selectedRange={selectedRange} />
      </div>
    );
  }
}

export default TimeRangeSlider;
