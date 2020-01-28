import React, { useState } from 'react';
import moment from 'moment';
import GoalChartDifference from './GoalChartDifference';
import { round } from 'mathjs';

const GoalDifference = ({handleSave, current: { duration, startDate, units, total, compId, tracker }}) => {
  const [record, setRecord] = useState(tracker);

  //calc time since goal started
  let time = moment().startOf('day').diff(startDate, 'days');
  if (time > duration)
    time = duration;

  //state for controlled variables
  const [today, setToday] = useState(record[time]);
  if (today === null) setToday('');

  //calc change to date
  let temp = record.filter(value => value !== null)
  let count = temp.pop() - record[0];
  let progress = `Change: ${count > 0 ? '+' : ''}${count} ${units}`

  //if value is less than zero, null, if value is empty ('') do not record, otherwise set value in array
  const handleChange = e => {
    if (e.target.value < 0)
      return null;
    else {
      setToday(e.target.value);
      setRecord(record.map((value, index) => {
        if (index === time) {
          if (e.target.value === '')
            return null;
          value = parseFloat(e.target.value);
        }
        return value;
      }));
    } 
  }

  return (
    <React.Fragment>
      <ul>
        <GoalChartDifference duration={duration} units={units} total={total} record={record} time={time}/>
        <li className='table-info lr-border center'>
          <strong>Record Your Progress</strong>
        </li>
        <li className='table-info lr-border center'>
          <span>
            Today: 
          </span>
          <span>
            <input 
              className='center'
              id='chart-input'
              type='number' 
              value={today} 
              name='today' 
              onChange={handleChange}
              min='0'
            />
            {units}
          </span>
        </li>
        <hr/>
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              {progress}
            </span>
            <span className='right'>
              Day: {time + 1} / {duration}
            </span>
          </div>
        </li>
        <li className='table-info lr-border'>Progress To Date: {round(count / (total - record[0]) * 100)}%</li>
      </ul>
      <button className='btn btn-primary btn-block' onClick={() => handleSave(record)}>
        Save Goal
      </button>
    </React.Fragment>
  )
}

export default GoalDifference;