import React, { useState } from 'react';
import moment from 'moment';
import GoalChartTotal from './GoalChartTotal';
import { round } from 'mathjs';

const GoalTotal = ({handleSave, current: { duration, startDate, units, total, compId, tracker }}) => {
  const [record, setRecord] = useState(tracker);

  //calc progress so far
  let runningTotal = 0;
  for (let i = 0; i < record.length; i++ ) {
    runningTotal += record[i];
  }

  //calc time since goal started
  let time = moment().startOf('day').diff(startDate, 'days');
  if (time > duration)
    time = duration;

  //state for controlled variables
  const [today, setToday] = useState(record[time]);
  const [yesterday, setYesterday] = useState(record[time - 1]);

  //if value is less than zero, null, if value is empty ('') set zero in array, otherwise set value in array
  const handleChange = e => {
    if (e.target.value < 0)
      return null;
    if(e.target.name === 'today') {
      setToday(e.target.value);
      setRecord(record.map((value, index) => {
        if (index === time) {
          if (e.target.value === '')
            value = 0;
          else value = parseFloat(e.target.value);
        }
        return value;
      }));
    } else {
      setYesterday(e.target.value);
      setRecord(record.map((value, index) => {
        if (index === time - 1) {
          if (e.target.value === '')
            value = 0;
          else value = parseFloat(e.target.value);
        }
        return value;
      }))
    }
  }

  return (
    <React.Fragment>
      <ul>
        <GoalChartTotal units={units} record={record} time={time}/>
        <li className='table-info lr-border center'>
          <strong>Record Your Progress</strong>
        </li>
        <li className='table-info lr-border center'>
          <span className='width-75'>
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
        <li className='table-info lr-border center'>
          <span className='width-75'>
            Yesterday:
          </span>
          <span>
            <input 
              className='center'
              id='chart-input'
              type='number' 
              value={yesterday} 
              name='yesterday' 
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
              Total: {runningTotal} / {total} {units}
            </span>
            <span className='right'>
              Day: {time + 1} / {duration}
            </span>
          </div>
        </li>
        <li className='table-info lr-border'>Goal Completion: {round(runningTotal / total * 100)}%</li>
      </ul>
      <button className='btn btn-primary btn-block' onClick={() => handleSave(record)}>
        Save Goal
      </button>
    </React.Fragment>
  )
}

export default GoalTotal;