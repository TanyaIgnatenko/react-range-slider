import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { range as makeRange } from '../../utils/array';

const HOURS_IN_DAY = 24;

const toBeautifulTimeString = hour =>
  `${hour < HOURS_IN_DAY ? hour : hour - HOURS_IN_DAY}:00`;

function Wireframe({ range, markStep }) {
  const hoursRange = makeRange(range.startHour, range.endHour);
  const lastHour = hoursRange[hoursRange.length - 1];

  const isMarkStep = step => step % markStep === 0;
  const isFirstStep = step => step === 0;

  return (
    <>
      {hoursRange.map((hour, step) =>
        isMarkStep(step) ? (
          <div className='time-interval-with-mark-box'>
            <p className='mark-label'>{toBeautifulTimeString(hour)}</p>
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
      <div className='time-interval-with-mark-box'>
        <p className='mark-label'>{toBeautifulTimeString(lastHour + 1)}</p>
        <div className={classNames('invisible-time-interval with-mark')} />
      </div>
    </>
  );
}

Wireframe.propTypes = {
  range: PropTypes.shape({
    startHour: PropTypes.number.isRequired,
    endHour: PropTypes.number.isRequired,
  }).isRequired,
  markStep: PropTypes.number,
};

Wireframe.defaultProps = {
  markStep: 4,
};

export default Wireframe;
