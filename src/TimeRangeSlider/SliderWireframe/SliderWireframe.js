import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { range as makeRange } from '../../utils/array';

function Wireframe({ min, max, minutesPerTimeUnit, formatLabel, labelMarkStep }) {
  const timeUnitsRange = makeRange(min, max, minutesPerTimeUnit);
  const lastTimeUnit = max;

  const islabelMarkStep = step => step % labelMarkStep === 0;
  const isFirstStep = step => step === 0;

  return (
    <>
      {timeUnitsRange.map((timeUnit, step) =>
        islabelMarkStep(step) ? (
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
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minutesPerTimeUnit: PropTypes.number.isRequired,
  formatLabel: PropTypes.func.isRequired,
  labelMarkStep: PropTypes.number,
};

Wireframe.defaultProps = {
  labelMarkStep: 4,
};

export default Wireframe;
