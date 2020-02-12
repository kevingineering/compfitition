import React from 'react';
import { round } from 'mathjs';
import moment from 'moment';

const GoalInfo = ({goal, time, record, value, isStarted}) => {

  const { duration, startDate, units, total, type } = goal;

  let topLeft = `Start Date: ${moment.utc(startDate).format('MMMM Do, YYYY')}`
  let topRight = null;
  let middleLeft = null;
  let middleRight = null;
  let bottomLeft = null;
  let bottomRight = null;

  if (isStarted) {
      //difference
      if (type === 'difference') {
        topRight = (time === duration) ? 
        `Duration: ${duration} days` :
        `Day: ${time + 1} / ${duration}`;
      middleLeft = `Start: ${record[0]} ${units}`;
      middleRight = `Goal: ${total} ${units}`;
      bottomLeft = (time === duration) ? 
        `Final: ${record[0] + value} ${units}` :
        `Current: ${record[0] + value} ${units}`;
      bottomRight = `Change: ${value > 0 ? '+' : ''}${value} ${units}`
    }
    //total
    else if (type === 'total') {
      topRight = (time === duration) ? 
        `Duration: ${duration} days` : 
        `Day: ${time + 1} / ${duration}`
        middleLeft = `Total: ${value} / ${total} ${units}`;
      middleRight = `Goal Completion: ${round(value / total * 100)}%`;
    }
    //pass/fail
    else if (type === 'pass/fail') {
      topRight = null;
      middleLeft = `Success To Date: ${value} / ${time > duration ? record.length : time + 1} (${round(value / (time + 1) * 100)}%)`
      bottomLeft = `Success Total: ${value} / ${record.length} (${round(value / record.length * 100)}%)`
    }
  }

  if (!isStarted) {
    topLeft = `Begins: ${moment.utc(startDate).format('MMMM Do, YYYY')}`
    topRight = `Duration: ${duration} days`
    if (type === 'difference') {
      middleLeft = `Start: ${record[0]} ${units}`;
      middleRight = `Goal: ${total} ${units}`;
    }
    else if (type === 'total') {
      middleLeft = `Goal: ${total} ${units}`;
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
      {type === 'pass/fail' && (time === duration || !isStarted) ? null :
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              {middleLeft}
            </span>
            <span className='right'>
              {middleRight}
            </span>
          </div>
        </li>
      }
      {type !== 'total' && isStarted &&
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

export default GoalInfo;