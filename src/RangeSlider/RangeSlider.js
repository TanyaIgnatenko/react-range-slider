import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { SliderWireframe } from './SliderWireframe';
import { SelectedRange } from './SelectedRange';
import { Handle } from './Handle';

import './RangeSlider.scss';

const MODE = {
  IDLE: 0,
  DRAG: 1,
};

class RangeSlider extends React.Component {
  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    selectedRange: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    formatLabel: PropTypes.func.isRequired,
    valuePerStep: PropTypes.number,
    labelMarkStep: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    valuePerStep: 1,
    labelMarkStep: 4,
    className: '',
  };

  state = {
    mode: MODE.IDLE,
    selectedRange: {
      start: null,
      end: null,
    },
  };

  componentDidMount() {
    this.measureElementsSize();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !_.isEqual(nextState, this.state);
    const propsChanged = !_.isEqual(nextState, this.props);

    const { mode } = this.state;
    return stateChanged || (propsChanged && mode !== MODE.DRAG);
  }

  handleResize = () => {
    this.measureElementsSize();
  };

  measureElementsSize() {
    const { width, left } = this.slider.getBoundingClientRect();
    this.sliderWidth = width;
    this.sliderLeft = left;
  }

  handleChangeStart = () => {
    this.switchToDragMode();
  };

  handleChangeEnd = () => {
    this.switchToIdleMode();
    this.animateSelectedRangeRounding();
  };

  switchToDragMode() {
    const { selectedRange } = this.props;
    this.setState({ mode: MODE.DRAG, selectedRange });
  }

  switchToIdleMode() {
    this.setState({ mode: MODE.IDLE, selectedRange: null });
  }

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

  handleStartHandleValueChange = value => {
    const { selectedRange } = this.state;
    const normalizedEnd = this.absoluteValueToNormalized(selectedRange.end);

    const newSelectedRange = {
      start: Math.min(value, normalizedEnd),
      end: Math.max(value, normalizedEnd),
    };

    this.handleSelectedRangeChange(newSelectedRange);
  };

  handleEndHandleValueChange = value => {
    const { selectedRange } = this.state;
    const normalizedStart = this.absoluteValueToNormalized(selectedRange.start);

    const newSelectedRange = {
      start: Math.min(normalizedStart, value),
      end: Math.max(normalizedStart, value),
    };

    this.handleSelectedRangeChange(newSelectedRange);
  };

  handleSelectedRangeChange = normalizedRange => {
    const absoluteRange = this.normalizedRangeToAbsolute(normalizedRange);
    this.setState({ selectedRange: absoluteRange });

    const { onChange } = this.props;
    const roundedAbsoluteRange = {
      start: this.roundValue(absoluteRange.start),
      end: this.roundValue(absoluteRange.end),
    };

    onChange(roundedAbsoluteRange);
  };

  roundValue = value => {
    const { valuePerStep } = this.props;
    return Math.round(value / valuePerStep) * valuePerStep;
  };

  normalizedRangeToAbsolute = absoluteRange => ({
    start: this.normalizedValueToAbsolute(absoluteRange.start),
    end: this.normalizedValueToAbsolute(absoluteRange.end),
  });

  absoluteRangeToNormalized = absoluteRange => ({
    start: this.absoluteValueToNormalized(absoluteRange.start),
    end: this.absoluteValueToNormalized(absoluteRange.end),
  });

  normalizedValueToAbsolute = normalizedValue => {
    const { min, max } = this.props;
    return normalizedValue * (max - min) + min;
  };

  absoluteValueToNormalized = absoluteValue => {
    const { min, max } = this.props;
    return (absoluteValue - min) / (max - min);
  };

  pagePositionToNormalizedValue = position => {
    return (position - this.sliderLeft) / this.sliderWidth;
  };

  setSliderRef = slider => (this.slider = slider);

  setSelectedRangeRef = selectedRange => (this.selectedRange = selectedRange);

  setStartHandleRef = handle => (this.startHandle = handle);

  setEndHandleRef = handle => (this.endHandle = handle);

  getSelectedRange() {
    const { mode } = this.state;
    switch (mode) {
      case MODE.IDLE:
        return this.props.selectedRange;
      case MODE.DRAG:
        return this.state.selectedRange;
    }
  }

  render() {
    const { min, max, formatLabel, valuePerStep, labelMarkStep, className } = this.props;

    const selectedRange = this.getSelectedRange();
    const normalizedSelectedRange = this.absoluteRangeToNormalized(selectedRange);

    return (
      <div ref={this.setSliderRef} className={classNames('slider-box', className)}>
        <Handle
          handleRef={this.setStartHandleRef}
          normalizedValue={normalizedSelectedRange.start}
          onChange={this.handleStartHandleValueChange}
          onChangeStart={this.handleChangeStart}
          onChangeEnd={this.handleChangeEnd}
          pagePositionToNormalizedValue={this.pagePositionToNormalizedValue}
        />
        <Handle
          handleRef={this.setEndHandleRef}
          normalizedValue={normalizedSelectedRange.end}
          onChange={this.handleEndHandleValueChange}
          onChangeStart={this.handleChangeStart}
          onChangeEnd={this.handleChangeEnd}
          pagePositionToNormalizedValue={this.pagePositionToNormalizedValue}
        />
        <SelectedRange
          selectedRangeRef={this.setSelectedRangeRef}
          normalizedRange={normalizedSelectedRange}
          onChange={this.handleSelectedRangeChange}
          onChangeStart={this.handleChangeStart}
          onChangeEnd={this.handleChangeEnd}
          pagePositionToNormalizedValue={this.pagePositionToNormalizedValue}
        />
        <SliderWireframe
          min={min}
          max={max}
          selectedRange={selectedRange}
          valuePerStep={valuePerStep}
          labelMarkStep={labelMarkStep}
          formatLabel={formatLabel}
        />
      </div>
    );
  }
}

export default RangeSlider;
