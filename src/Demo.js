import React, { useState } from 'react';

import { TimeRangeSlider } from './TimeRangeSlider';

import './Demo.scss';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const FIRST_TIME_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 26 * MINUTES_IN_HOUR,
};

const SECOND_TIME_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 13.5 * MINUTES_IN_HOUR,
};

const THIRD_TIME_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 11.25 * MINUTES_IN_HOUR,
};

const FOURTH_TIME_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 11.25 * MINUTES_IN_HOUR,
};

const FIFTH_TIME_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 13.5 * MINUTES_IN_HOUR,
};

const toTimeLabel = minutes => {
  const hours = Math.floor(minutes / MINUTES_IN_HOUR) % HOURS_IN_DAY;
  let minutesRest = minutes % MINUTES_IN_HOUR;
  minutesRest = minutesRest < 10 ? `0${minutesRest}` : minutesRest;
  return `${hours}:${minutesRest}`;
};

function Demo() {
  const [firstSelectedRange, setFirstSelectedRange] = useState(FIRST_TIME_SLIDER_RANGE);

  const [secondSelectedRange, setSecondSelectedRange] = useState(SECOND_TIME_SLIDER_RANGE);

  const [thirdSelectedRange, setThirdSelectedRange] = useState(THIRD_TIME_SLIDER_RANGE);

  const [fourthSelectedRange, setFourthSelectedRange] = useState(FOURTH_TIME_SLIDER_RANGE);

  const [fifthSelectedRange, setFifthSelectedRange] = useState(FIFTH_TIME_SLIDER_RANGE);

  return (
    <div className='app-container'>
      <TimeRangeSlider
        range={FIRST_TIME_SLIDER_RANGE}
        timeUnitMinutes={60}
        selectedRange={firstSelectedRange}
        onSelectedRangeChange={setFirstSelectedRange}
        formatLabel={toTimeLabel}
        className='time-range-slider'
      />
      <TimeRangeSlider
        range={THIRD_TIME_SLIDER_RANGE}
        timeUnitMinutes={15}
        markStep={1}
        selectedRange={thirdSelectedRange}
        onSelectedRangeChange={setThirdSelectedRange}
        formatLabel={toTimeLabel}
        className='time-range-slider'
      />
      <TimeRangeSlider
        range={SECOND_TIME_SLIDER_RANGE}
        timeUnitMinutes={30}
        markStep={1}
        selectedRange={secondSelectedRange}
        onSelectedRangeChange={setSecondSelectedRange}
        formatLabel={toTimeLabel}
        className='time-range-slider'
      />
      <TimeRangeSlider
        range={FOURTH_TIME_SLIDER_RANGE}
        timeUnitMinutes={15}
        markStep={2}
        selectedRange={fourthSelectedRange}
        onSelectedRangeChange={setFourthSelectedRange}
        formatLabel={toTimeLabel}
        className='time-range-slider'
      />
      <TimeRangeSlider
        range={FIFTH_TIME_SLIDER_RANGE}
        timeUnitMinutes={30}
        markStep={3}
        selectedRange={fifthSelectedRange}
        onSelectedRangeChange={setFifthSelectedRange}
        formatLabel={toTimeLabel}
        className='time-range-slider'
      />
    </div>
  );
}

export default Demo;
