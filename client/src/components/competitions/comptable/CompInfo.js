import React from 'react';
import moment from 'moment';

const CompInfo = ({goal, time, record, value, isStarted}) => {

  const { duration, startDate, units, type } = goal;

  let topLeft = `Start Date: ${moment.utc(startDate).format('MMMM Do, YYYY')}`
  let topRight = (time === duration) ? 
    `Duration: ${duration} days` : 
    `Day: ${time + 1} / ${duration}`;
  let bottomLeft = null;
  let bottomRight = null;

  if (isStarted) {
    //difference
    if (type === 'difference') {
      bottomLeft = `Start: ${record[0]} ${units}`;
      bottomRight = (time === duration) ? 
        `Final: ${record[0] + value} ${units}` :
        `Change: ${value} ${units}`;
    }
  }

  if (!isStarted) {
    topLeft = `Begins: ${moment.utc(startDate).format('MMMM Do, YYYY')}`
    topRight = `Duration: ${duration} days`
    if (type === 'difference') {
      bottomLeft = `Start: ${record[0]} ${units}`;
    }
  }
  
  return (
    <React.Fragment>
      <li className='table-info lr-border'>
        <div className='space-between'>
          <span>
            {topLeft}
          </span>
          <span className='right'>
            {topRight}
          </span>
        </div>
      </li>
      {type === 'difference' &&
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              {bottomLeft}
            </span>
            <span className='right'>
              {bottomRight}
            </span>
          </div>
        </li>
      }
    </React.Fragment>
  )
}

export default CompInfo;