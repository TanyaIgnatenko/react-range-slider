import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Wireframe } from './Wireframe';
import { Placer } from '../utils/Placer';

import './TimeRangeSlider.scss';

const POSITION_UNIT = 'px';

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

  componentDidMount() {
    this.measureElementsSize();

    this.handlersPlacer = new Placer({
      relatedToContainer: this.slider,
      minLeft: -this.SLIDER_HANDLER_HALF_WIDTH,
      maxLeft: this.SLIDER_WIDTH - this.SLIDER_HANDLER_HALF_WIDTH,
    });

    this.selectedRangePlacer = new Placer({
      relatedToContainer: this.slider,
      minLeft: 0,
      maxLeft: this.SLIDER_WIDTH - this.selectedRangeLength,
    });

    this.slider.addEventListener('mousedown', this.grabObject);
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedRange !== this.props.selectedRange) {
      this.updateSelectedRangePlacerPositionLimitations();
    }
    if (prevProps.range !== this.props.range) {
      this.measureElementsSize();
      this.updateHandlersPlacerPositionLimitations();
      this.updateSelectedRangePlacerPositionLimitations();
    }
  }

  componentWillUnmount() {
    this.slider.removeEventListener('mousedown', this.grabObject);
  }

  grabObject = ({ target, offsetX, offsetY }) => {
    this.grabbedObject = {
      name: target.getAttribute('name'),
      cursorShiftX: offsetX,
      cursorShiftY: offsetY,
    };

    document.addEventListener('mousemove', this.handleObjectMove);
    document.addEventListener('mouseup', this.releaseObject);
  };

  releaseObject = () => {
    this.grabbedObject = null;
    document.removeEventListener('mousemove', this.handleObjectMove);
    document.removeEventListener('mouseup', this.releaseObject);
  };

  handleObjectMove = ({ clientX: pageX, clientY: pageY }) => {
    const pagePosition = {
      left: pageX + this.grabbedObject.cursorShiftX,
      top: pageY + this.grabbedObject.cursorShiftY,
    };

    switch (this.grabbedObject.name) {
      case 'first-handler':
        this.handleFirstHandlerMove(pagePosition);
        break;
      case 'second-handler':
        this.handleSecondHandlerMove(pagePosition);
        break;
      case 'selected-range':
        this.handleSelectedRangeMove(pagePosition);
        break;
      default:
    }
  };

  handleFirstHandlerMove = pagePosition => {
    const { selectedRange } = this.props;

    const sliderPosition = this.handlersPlacer.place(pagePosition);

    const handlerCenter = sliderPosition.left + this.SLIDER_HANDLER_HALF_WIDTH;
    const newSelectedRange = {
      startHour: Math.round(this.toHour(handlerCenter)),
      endHour: !this.handlersCrossed
        ? selectedRange.endHour
        : selectedRange.startHour,
    };

    this.handleSelectedRangeChange(newSelectedRange);
  };

  handleSecondHandlerMove = pagePosition => {
    const { selectedRange } = this.props;

    const sliderPosition = this.handlersPlacer.place(pagePosition);

    const handlerCenter = sliderPosition.left + this.SLIDER_HANDLER_HALF_WIDTH;
    const newSelectedRange = {
      startHour: !this.handlersCrossed
        ? selectedRange.startHour
        : selectedRange.endHour,
      endHour: Math.round(this.toHour(handlerCenter)),
    };

    this.handleSelectedRangeChange(newSelectedRange);
  };

  handleSelectedRangeMove = pagePosition => {
    const {
      selectedRange: { startHour, endHour },
    } = this.props;

    const sliderPosition = this.selectedRangePlacer.place(pagePosition);

    const lastStartRangePosition = this.toSliderPosition(startHour);
    const lastEndRangePosition = this.toSliderPosition(endHour);
    const moveX = sliderPosition.left - lastStartRangePosition;

    const newSelectedRange = {
      startHour: Math.round(this.toHour(lastStartRangePosition + moveX)),
      endHour: Math.round(this.toHour(lastEndRangePosition + moveX)),
    };

    this.handleSelectedRangeChange(newSelectedRange);
  };

  handleSelectedRangeChange = ({ startHour, endHour }) => {
    this.handlersCrossed = startHour > endHour;

    const selectedRange = !this.handlersCrossed
      ? {
          startHour,
          endHour,
        }
      : {
          startHour: endHour,
          endHour: startHour,
        };

    const { onSelectedRangeChange } = this.props;
    onSelectedRangeChange(selectedRange);
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

    this.SLIDER_HANDLER_HALF_WIDTH = this.handler.offsetWidth / 2;
  }

  updateHandlersPlacerPositionLimitations() {
    this.handlersPlacer.setMinLeft(-this.SLIDER_HANDLER_HALF_WIDTH);
    this.handlersPlacer.setMaxLeft(
      this.SLIDER_WIDTH - this.SLIDER_HANDLER_HALF_WIDTH,
    );
  }

  updateSelectedRangePlacerPositionLimitations() {
    this.selectedRangePlacer.setMaxLeft(
      this.SLIDER_WIDTH - this.selectedRangeLength,
    );
  }

  setSliderRef = slider => (this.slider = slider);

  setHandlerRef = handler => (this.handler = handler);

  render() {
    const { range, selectedRange, markStep, className } = this.props;

    const startHandlerPosition = this.toSliderPosition(selectedRange.startHour);
    const endHandlerPosition = this.toSliderPosition(selectedRange.endHour);

    const firstHandlerPosition = this.handlersCrossed
      ? endHandlerPosition
      : startHandlerPosition;
    const secondHandlerPosition = this.handlersCrossed
      ? startHandlerPosition
      : endHandlerPosition;

    const selectedRangePosition = startHandlerPosition;
    this.selectedRangeLength = endHandlerPosition - startHandlerPosition;

    return (
      <div ref={this.setSliderRef} className={classNames('slider', className)}>
        <div
          name='first-handler'
          className='slider-handler'
          ref={this.setHandlerRef}
          style={{ left: firstHandlerPosition + POSITION_UNIT }}
        />
        <div
          name='second-handler'
          className='slider-handler'
          style={{ left: secondHandlerPosition + POSITION_UNIT }}
        />
        <div
          name='selected-range'
          className='selected-range'
          style={{
            left: selectedRangePosition + POSITION_UNIT,
            width: this.selectedRangeLength + POSITION_UNIT,
          }}
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
