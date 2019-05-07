import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

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

  grab = ({ target: selectedRange, pageX: cursorX }) => {
    const { onChangeStart } = this.props;

    const selectedRangeLeft = selectedRange.getBoundingClientRect().left;
    this.cursorShift = cursorX - selectedRangeLeft;

    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.release);

    onChangeStart();
  };

  move = ({ pageX: cursorPageValue }) => {
    const { normalizedRange, onChange } = this.props;
    const { pagePositionToNormalizedValue: normalizeValue } = this.props;

    const normalizedRangeLength = normalizedRange.end - normalizedRange.start;

    const newNormalizedRangeStart = normalizeValue(cursorPageValue - this.cursorShift);
    const newNormalizedRangeEnd = newNormalizedRangeStart + normalizedRangeLength;

    const newNormalizedRange = {
      start: _.clamp(newNormalizedRangeStart, 0, 1 - normalizedRangeLength),
      end: _.clamp(newNormalizedRangeEnd, normalizedRangeLength, 1),
    };

    if (!_.isEqual(newNormalizedRange, normalizedRange)) {
      onChange(newNormalizedRange);
    }
  };

  release = () => {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.release);

    const { onChangeEnd } = this.props;
    onChangeEnd();
  };

  render() {
    const { normalizedRange, selectedRangeRef } = this.props;
    return (
      <div
        ref={selectedRangeRef}
        className='selected-range'
        style={{
          left: normalizedRange.start * 100 + CSS_UNIT,
          width: (normalizedRange.end - normalizedRange.start) * 100 + CSS_UNIT,
        }}
        onMouseDown={this.grab}
      />
    );
  }
}

export default SelectedRange;
