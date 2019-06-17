import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { range as makeRange } from '../utils/array';

import './SliderWireframe.scss';

function Wireframe({ min, max, valuePerStep, formatLabel, labelMarkStep }) {
  const rangeUnits = makeRange(min, max, valuePerStep);
  const lastUnit = max;

  const islabelMarkStep = step => step % labelMarkStep === 0;
  const isFirstStep = step => step === 0;

  return (
    <>
      {rangeUnits.map((unit, step) =>
        islabelMarkStep(step) ? (
          <div key={unit} className='time-interval-with-mark-box'>
            <p className={classNames('mark-label', { first: isFirstStep(step) })}>
              {formatLabel(unit)}
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
        <p className='mark-label last'>{formatLabel(lastUnit)}</p>
        <div className={classNames('invisible-time-interval with-mark')} />
      </div>
    </>
  );
}

Wireframe.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  formatLabel: PropTypes.func.isRequired,
  valuePerStep: PropTypes.number.isRequired,
  labelMarkStep: PropTypes.number,
};

Wireframe.defaultProps = {
  labelMarkStep: 4,
};

export default Wireframe;
