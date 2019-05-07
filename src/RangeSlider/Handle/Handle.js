import React from 'react';
import PropTypes from 'prop-types';
import { clamp } from '../utils/clamp';

const CSS_UNIT = '%';

class Handle extends React.Component {
  static propTypes = {
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

  grab = ({ target: handle, pageX: cursorX }) => {
    const { onChangeStart } = this.props;

    const handleLeft = handle.getBoundingClientRect().left;
    this.cursorShift = cursorX - handleLeft;

    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.release);

    onChangeStart();
  };

  move = ({ pageX: cursorPagePosition }) => {
    const { normalizedValue: oldValue, onChange } = this.props;
    const { pagePositionToNormalizedValue: normalizeValue } = this.props;

    const normalizedValue = normalizeValue(cursorPagePosition - this.cursorShift);
    const newValue = clamp(normalizedValue, 0, 1);

    if (newValue !== oldValue) {
      onChange(newValue);
    }
  };

  release = () => {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.release);

    const { onChangeEnd } = this.props;
    onChangeEnd();
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
        onMouseDown={this.grab}
      />
    );
  }
}

Handle.propTypes = {};

export default Handle;
