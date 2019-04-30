import React, { useState } from 'react';

import { TimeRangeSlider } from './TimeRangeSlider';

import './Demo.scss';

const MIN_HOUR = 10;
const MAX_HOUR = 26;
const TIME_SLIDER_RANGE = {
  startHour: MIN_HOUR,
  endHour: MAX_HOUR,
};

function Demo() {
  const [selectedRange, setSelectedRange] = useState({
    startHour: 10,
    endHour: 26,
  });

  return (
    <div className='app-container'>
      <TimeRangeSlider
        range={TIME_SLIDER_RANGE}
        selectedRange={selectedRange}
        onSelectedRangeChange={setSelectedRange}
        className='time-range-slider'
      />
    </div>
  );
}

export default Demo;
