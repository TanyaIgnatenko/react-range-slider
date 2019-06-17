import React from 'react';
import PropTypes from 'prop-types';

import { clamp } from '../utils/clamp';

import './Handle.scss';

const CSS_UNIT = '%';

class Handle extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    normalizedValue: PropTypes.number.isRequired,
    pagePositionToNormalizedValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeStart: PropTypes.func,
    onChangeEnd: PropTypes.func,
    handleRef: PropTypes.func,
  };

  static defaultProps = {
    onChangeStart: () => {},
    onChangeEnd: () => {},
    handleRef: null,
  };

  cursorShift = null;

  grab = event => {
    const { target: handle, pageX: cursorX } = event;
    const { onChangeStart, name } = this.props;

    const handleLeft = handle.getBoundingClientRect().left;
    this.cursorShift = cursorX - handleLeft;

    document.addEventListener('pointermove', this.move);
    document.addEventListener('pointerup', this.release);

    onChangeStart(name);

    event.stopPropagation();
    event.preventDefault();
  };

  move = event => {
    const { pageX: cursorPagePosition } = event;
    const { normalizedValue: oldValue, onChange, name } = this.props;
    const { pagePositionToNormalizedValue: normalizeValue } = this.props;

    const normalizedValue = normalizeValue(cursorPagePosition - this.cursorShift);
    const newValue = clamp(normalizedValue, 0, 1);

    if (newValue !== oldValue) {
      onChange(name, newValue);
    }

    event.stopPropagation();
    event.preventDefault();
  };

  release = event => {
    document.removeEventListener('pointermove', this.move);
    document.removeEventListener('pointerup', this.release);

    const { onChangeEnd, name } = this.props;
    onChangeEnd(name);

    event.stopPropagation();
    event.preventDefault();
  };

  render() {
    const { handleRef, normalizedValue } = this.props;
    return (
      <div
        className='slider-handle'
        ref={handleRef}
        style={{
          left: normalizedValue * 100 + CSS_UNIT,
          transform: 'translateX(-50%)',
        }}
        onPointerDown={this.grab}
      />
    );
  }
}

Handle.propTypes = {};

export default Handle;
