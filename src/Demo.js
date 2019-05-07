import React, { useState } from 'react';

import RangeSlider from './RangeSlider/RangeSlider';

import './Demo.scss';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const FIRST_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 26 * MINUTES_IN_HOUR,
};

const SECOND_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 13.5 * MINUTES_IN_HOUR,
};

const THIRD_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 11.25 * MINUTES_IN_HOUR,
};

const FOURTH_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 11.25 * MINUTES_IN_HOUR,
};

const FIFTH_SLIDER_RANGE = {
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
  const [firstSelectedRange, setFirstSelectedRange] = useState(FIRST_SLIDER_RANGE);

  const [secondSelectedRange, setSecondSelectedRange] = useState(SECOND_SLIDER_RANGE);

  const [thirdSelectedRange, setThirdSelectedRange] = useState(THIRD_SLIDER_RANGE);

  const [fourthSelectedRange, setFourthSelectedRange] = useState(FOURTH_SLIDER_RANGE);

  const [fifthSelectedRange, setFifthSelectedRange] = useState(FIFTH_SLIDER_RANGE);

  return (
    <div className='app-container'>
      <RangeSlider
        min={FIRST_SLIDER_RANGE.start}
        max={FIRST_SLIDER_RANGE.end}
        valuePerStep={60}
        selectedRange={firstSelectedRange}
        onChange={setFirstSelectedRange}
        formatLabel={toTimeLabel}
        className='range-slider'
      />
      <RangeSlider
        min={SECOND_SLIDER_RANGE.start}
        max={SECOND_SLIDER_RANGE.end}
        valuePerStep={30}
        labelMarkStep={1}
        selectedRange={secondSelectedRange}
        onChange={setSecondSelectedRange}
        formatLabel={toTimeLabel}
        className='range-slider'
      />
      <RangeSlider
        min={THIRD_SLIDER_RANGE.start}
        max={THIRD_SLIDER_RANGE.end}
        valuePerStep={15}
        labelMarkStep={1}
        selectedRange={thirdSelectedRange}
        onChange={setThirdSelectedRange}
        formatLabel={toTimeLabel}
        className='range-slider'
      />
      <RangeSlider
        min={FOURTH_SLIDER_RANGE.start}
        max={FOURTH_SLIDER_RANGE.end}
        valuePerStep={15}
        labelMarkStep={2}
        selectedRange={fourthSelectedRange}
        onChange={setFourthSelectedRange}
        formatLabel={toTimeLabel}
        className='range-slider'
      />
      <RangeSlider
        min={FIFTH_SLIDER_RANGE.start}
        max={FIFTH_SLIDER_RANGE.end}
        valuePerStep={30}
        labelMarkStep={3}
        selectedRange={fifthSelectedRange}
        onChange={setFifthSelectedRange}
        formatLabel={toTimeLabel}
        className='range-slider'
      />
    </div>
  );
}

export default Demo;
