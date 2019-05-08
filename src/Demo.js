import React, { useState } from 'react';

import RangeSlider from './RangeSlider/RangeSlider';

import githubLogo from './github-logo.svg';

import './Demo.scss';

const repoLink = 'https://github.com/TanyaIgnatenko/react-range-slider';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const HOUR_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 26 * MINUTES_IN_HOUR,
};

const HALF_HOUR_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 13.5 * MINUTES_IN_HOUR,
};

const HOUR_QUARTER_SLIDER_RANGE = {
  start: 10 * MINUTES_IN_HOUR,
  end: 11.25 * MINUTES_IN_HOUR,
};

const PRICE_SLIDER_RANGE = {
  start: 100,
  end: 3000,
};

const YEAR_SLIDER_RANGE = {
  start: 2015,
  end: 2020,
};

const MONTH_SLIDER_RANGE = {
  start: 1,
  end: 5,
};

const toPriceLabel = price => `$${price}`;

const toYearLabel = year => year;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const toMonthLabel = month => months[month - 1];

const toTimeLabel = minutes => {
  const hours = Math.floor(minutes / MINUTES_IN_HOUR) % HOURS_IN_DAY;
  let minutesRest = minutes % MINUTES_IN_HOUR;
  minutesRest = minutesRest < 10 ? `0${minutesRest}` : minutesRest;
  return `${hours}:${minutesRest}`;
};

function Demo() {
  const [hourSelectedRange, setHourSelectedRange] = useState(HOUR_SLIDER_RANGE);

  const [halfHourSelectedRange, setHalfHourSelectedRange] = useState(HALF_HOUR_SLIDER_RANGE);

  const [hourQuarterSelectedRange, setHourQuarterSelectedRange] = useState(
    HOUR_QUARTER_SLIDER_RANGE,
  );

  const [priceSelectedRange, setPriceSelectedRange] = useState({ start: 1100, end: 3000 });

  const [yearSelectedRange, setYearSelectedRange] = useState(YEAR_SLIDER_RANGE);

  const [monthSelectedRange, setMonthSelectedRange] = useState(MONTH_SLIDER_RANGE);

  return (
    <div className='app-container'>
      <a href={repoLink} className='app-link-container'>
        <img className='github-icon' src={githubLogo} />
        <h1 className='title'>react-range-slider</h1>
      </a>

      <div className='usage-examples'>
        <div className='category-examples-container'>
          <h2 className='sub-title'>Price</h2>
          <RangeSlider
            min={PRICE_SLIDER_RANGE.start}
            max={PRICE_SLIDER_RANGE.end}
            valuePerStep={100}
            labelMarkStep={5}
            selectedRange={priceSelectedRange}
            onChange={setPriceSelectedRange}
            formatLabel={toPriceLabel}
            className='range-slider'
          />
        </div>
        <div className='category-examples-container'>
          <h2 className='sub-title'>Years</h2>
          <RangeSlider
            min={YEAR_SLIDER_RANGE.start}
            max={YEAR_SLIDER_RANGE.end}
            valuePerStep={1}
            labelMarkStep={1}
            selectedRange={yearSelectedRange}
            onChange={setYearSelectedRange}
            formatLabel={toYearLabel}
            className='range-slider'
          />
        </div>

        <div className='category-examples-container'>
          <h2 className='sub-title'>Months</h2>
          <RangeSlider
            min={MONTH_SLIDER_RANGE.start}
            max={MONTH_SLIDER_RANGE.end}
            valuePerStep={1}
            labelMarkStep={1}
            selectedRange={monthSelectedRange}
            onChange={setMonthSelectedRange}
            formatLabel={toMonthLabel}
            className='range-slider'
          />
        </div>

        <div className='category-examples-container'>
          <h2 className='sub-title'>Time</h2>
          <RangeSlider
            min={HOUR_SLIDER_RANGE.start}
            max={HOUR_SLIDER_RANGE.end}
            valuePerStep={60}
            selectedRange={hourSelectedRange}
            onChange={setHourSelectedRange}
            formatLabel={toTimeLabel}
            className='range-slider'
          />
          <RangeSlider
            min={HALF_HOUR_SLIDER_RANGE.start}
            max={HALF_HOUR_SLIDER_RANGE.end}
            valuePerStep={30}
            labelMarkStep={1}
            selectedRange={halfHourSelectedRange}
            onChange={setHalfHourSelectedRange}
            formatLabel={toTimeLabel}
            className='range-slider'
          />
          <RangeSlider
            min={HOUR_QUARTER_SLIDER_RANGE.start}
            max={HOUR_QUARTER_SLIDER_RANGE.end}
            valuePerStep={15}
            labelMarkStep={1}
            selectedRange={hourQuarterSelectedRange}
            onChange={setHourQuarterSelectedRange}
            formatLabel={toTimeLabel}
            className='range-slider'
          />
        </div>
      </div>
    </div>
  );
}

export default Demo;
