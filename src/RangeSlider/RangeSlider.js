import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

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

  firstHandleName = 'start';
  secondHandleName = 'end';

  componentDidMount() {
    this.measureElementsSize();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);
    const propsChanged = !isEqual(nextState, this.props);

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
    this.firstHandle.classList.add('smooth-position-transition');
    this.secondHandle.classList.add('smooth-position-transition');

    setTimeout(this.finishSelectedRangeRoundingAnimation, 500);
  }

  finishSelectedRangeRoundingAnimation = () => {
    this.selectedRange.classList.remove('smooth-position-transition');
    this.firstHandle.classList.remove('smooth-position-transition');
    this.secondHandle.classList.remove('smooth-position-transition');
  };

  handleHandleValueChange = (handle, value) => {
    const { selectedRange } = this.state;

    const normalizedRange = this.absoluteRangeToNormalized(selectedRange);
    normalizedRange[handle] = value;

    if (normalizedRange.start > normalizedRange.end) {
      [normalizedRange.start, normalizedRange.end] = [normalizedRange.end, normalizedRange.start];
      this.swapHandlesWhileDrag();
    }

    this.handleSelectedRangeChange(normalizedRange);
  };

  swapHandlesWhileDrag() {
    [this.firstHandleName, this.secondHandleName] = [this.secondHandleName, this.firstHandleName];
    this.handlesSwappedWhileDrag = !this.handlesSwappedWhileDrag;
  }

  handleSelectedRangeChange = normalizedRange => {
    const absoluteRange = this.normalizedRangeToAbsolute(normalizedRange);
    this.setState({ selectedRange: absoluteRange });

    const { onChange } = this.props;
    const roundedRange = {
      start: this.roundValue(absoluteRange.start),
      end: this.roundValue(absoluteRange.end),
    };

    onChange(roundedRange);
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

  setFirstHandleRef = handle => (this.firstHandle = handle);

  setSecondHandleRef = handle => (this.secondHandle = handle);

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
          name={this.firstHandleName}
          handleRef={this.setFirstHandleRef}
          normalizedValue={normalizedSelectedRange[this.firstHandleName]}
          onChange={this.handleHandleValueChange}
          onChangeStart={this.handleChangeStart}
          onChangeEnd={this.handleChangeEnd}
          pagePositionToNormalizedValue={this.pagePositionToNormalizedValue}
        />
        <Handle
          name={this.secondHandleName}
          handleRef={this.setSecondHandleRef}
          normalizedValue={normalizedSelectedRange[this.secondHandleName]}
          onChange={this.handleHandleValueChange}
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
