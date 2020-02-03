import React, { useState } from 'react';
import moment from 'moment';
import GoalChartTotal from './GoalChartTotal';
import { round } from 'mathjs';
import PropTypes from 'prop-types';

const GoalTotal = ({handleSave, goalCurrent: { duration, startDate, units, total, compId, tracker }}) => {
  const [record, setRecord] = useState(tracker);

  //calc progress so far
  let runningTotal = 0;
  for (let i = 0; i < record.length; i++ ) {
    runningTotal += record[i];
  }

  //calc time since goal started
  let time = moment().startOf('day').diff(startDate, 'days');
  let timeHours = moment().startOf('day').diff(startDate, 'hours')
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
      {timeHours >= 0 ? (
        <React.Fragment>
          <ul>
            <GoalChartTotal units={units} record={record} time={time}/>
            {time !== duration && (
              <React.Fragment>
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
                {time > 0 &&
                  <React.Fragment>
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
                  </React.Fragment>
                }
              </React.Fragment>
            )}
            <li className='table-info lr-border'>
              <div className='space-between'>
                <span>
                  Start Date: {moment.utc(startDate).format('MMMM Do, YYYY')}
                </span>
                <span className='right'>
                  {time === duration ? 
                  `Duration: ${duration} days` : 
                  `Day: ${time + 1} / ${duration}`}
                </span>
              </div>
            </li>
            <li className='table-info lr-border'>
              <div className='space-between'>
                <span>
                  Total: {runningTotal} / {total} {units}
                </span>
                <span className='right'>
                  Goal Completion: {round(runningTotal / total * 100)}%
                </span>
              </div>
            </li>
          </ul>
          <button 
            className='btn btn-primary btn-block' 
            onClick={() => handleSave(record)}
          >
            Save Goal
          </button>
          <p className='lr-border'/>
        </React.Fragment>
      ) : (
        <ul>
          <li className='table-info lr-border'>
            <div className='space-between'>
              <span>
                Goal: {total} {units}
              </span>
              <span className='right'>
                Begins {moment.utc(startDate).format('MMM Do')}
              </span>
            </div>
          </li>
          <li className='table-info lr-border'>
            <div className='space-between'>
              <span>
                Duration: {duration} days
              </span>
            </div>
          </li>
        </ul>
      )
      }
    </React.Fragment>
  )
}

GoalTotal.propTypes = {
  handleSave: PropTypes.func.isRequired,
  goalCurrent: PropTypes.object.isRequired
}

export default GoalTotal;