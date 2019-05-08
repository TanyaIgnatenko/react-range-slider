import React, { useState } from 'react';

import RangeSlider from './RangeSlider/RangeSlider';

import githubLogo from './github-logo.svg';

import './Demo.scss';

const repoLink = 'https://github.com/TanyaIgnatenko/react-range-slider';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

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
  const [priceSelectedRange, setPriceSelectedRange] = useState({ start: 600, end: 3000 });
  const [yearSelectedRange, setYearSelectedRange] = useState({ start: 2015, end: 2018 });
  const [monthSelectedRange, setMonthSelectedRange] = useState({ start: 3, end: 5 });

  const [hourSelectedRange, setHourSelectedRange] = useState({
    start: 14 * MINUTES_IN_HOUR,
    end: 22 * MINUTES_IN_HOUR,
  });

  const [halfHourSelectedRange, setHalfHourSelectedRange] = useState({
    start: 11.5 * MINUTES_IN_HOUR,
    end: 13 * MINUTES_IN_HOUR,
  });

  const [hourQuarterSelectedRange, setHourQuarterSelectedRange] = useState({
    start: 10 * MINUTES_IN_HOUR,
    end: 11.25 * MINUTES_IN_HOUR,
  });

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
            min={100}
            max={3000}
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
            min={2015}
            max={2020}
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
            min={1}
            max={5}
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
            min={10 * MINUTES_IN_HOUR}
            max={26 * MINUTES_IN_HOUR}
            valuePerStep={60}
            selectedRange={hourSelectedRange}
            onChange={setHourSelectedRange}
            formatLabel={toTimeLabel}
            className='range-slider'
          />
          <RangeSlider
            min={10 * MINUTES_IN_HOUR}
            max={13.5 * MINUTES_IN_HOUR}
            valuePerStep={30}
            labelMarkStep={1}
            selectedRange={halfHourSelectedRange}
            onChange={setHalfHourSelectedRange}
            formatLabel={toTimeLabel}
            className='range-slider'
          />
          <RangeSlider
            min={10 * MINUTES_IN_HOUR}
            max={11.25 * MINUTES_IN_HOUR}
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
