import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { clamp } from '../utils/clamp';

import './SelectedRange.scss';

const CSS_UNIT = '%';

class SelectedRange extends React.Component {
  static propTypes = {
    normalizedRange: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }).isRequired,
    pagePositionToNormalizedValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeStart: PropTypes.func,
    onChangeEnd: PropTypes.func,
    selectedRangeRef: PropTypes.func,
  };

  static defaultProps = {
    onChangeStart: () => {},
    onChangeEnd: () => {},
    selectedRangeRef: null,
  };

  cursorShift = null;

  grab = event => {
    const { target: selectedRange, pageX: cursorX } = event;
    const { onChangeStart } = this.props;

    const selectedRangeLeft = selectedRange.getBoundingClientRect().left;
    this.cursorShift = cursorX - selectedRangeLeft;

    document.addEventListener('pointermove', this.move);
    document.addEventListener('pointerup', this.release);

    onChangeStart();

    event.stopPropagation();
    event.preventDefault();
  };

  move = event => {
    const { pageX: cursorPageValue } = event;
    const { normalizedRange, onChange } = this.props;
    const { pagePositionToNormalizedValue: normalizeValue } = this.props;

    const normalizedRangeLength = normalizedRange.end - normalizedRange.start;

    const newNormalizedRangeStart = normalizeValue(cursorPageValue - this.cursorShift);
    const newNormalizedRangeEnd = newNormalizedRangeStart + normalizedRangeLength;

    const newNormalizedRange = {
      start: clamp(newNormalizedRangeStart, 0, 1 - normalizedRangeLength),
      end: clamp(newNormalizedRangeEnd, normalizedRangeLength, 1),
    };

    if (!isEqual(newNormalizedRange, normalizedRange)) {
      onChange(newNormalizedRange);
    }

    event.stopPropagation();
    event.preventDefault();
  };

  release = event => {
    document.removeEventListener('pointermove', this.move);
    document.removeEventListener('pointerup', this.release);

    const { onChangeEnd } = this.props;
    onChangeEnd();

    event.stopPropagation();
    event.preventDefault();
  };

  render() {
    const { normalizedRange, selectedRangeRef } = this.props;

    const selectedRangeStart = Math.min(normalizedRange.start, normalizedRange.end);
    const selectedRangeLength = Math.abs(normalizedRange.end - normalizedRange.start);

    return (
      <div
        ref={selectedRangeRef}
        className='selected-range'
        style={{
          left: selectedRangeStart * 100 + CSS_UNIT,
          width: selectedRangeLength * 100 + CSS_UNIT,
        }}
        onPointerDown={this.grab}
      />
    );
  }
}

export default SelectedRange;
