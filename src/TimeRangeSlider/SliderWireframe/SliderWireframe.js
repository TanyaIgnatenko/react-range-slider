import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { range as makeRange } from '../../utils/array';

function Wireframe({ range, timeUnitMinutes, formatLabel, markStep }) {
  const timeUnitsRange = makeRange(range.start, range.end, timeUnitMinutes);
  const lastTimeUnit = range.end;

  const isMarkStep = step => step % markStep === 0;
  const isFirstStep = step => step === 0;

  return (
    <>
      {timeUnitsRange.map((timeUnit, step) =>
        isMarkStep(step) ? (
          <div className='time-interval-with-mark-box'>
            <p className={classNames('mark-label', { first: isFirstStep(step) })}>
              {formatLabel(timeUnit)}
            </p>
            <div
              className={classNames('time-interval with-mark', {
                first: isFirstStep(step),
              })}
            />
          </div>
        ) : (
          <div className={classNames('time-interval')} />
        ),
      )}
      <div className='invisible-time-interval-with-mark-box'>
        <p className='mark-label last'>{formatLabel(lastTimeUnit)}</p>
        <div className={classNames('invisible-time-interval with-mark')} />
      </div>
    </>
  );
}

Wireframe.propTypes = {
  range: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
  timeUnitMinutes: PropTypes.number.isRequired,
  formatLabel: PropTypes.func.isRequired,
  markStep: PropTypes.number,
};

Wireframe.defaultProps = {
  markStep: 4,
};

export default Wireframe;
