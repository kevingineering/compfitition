import React, { useState } from 'react';
import moment from 'moment';
import GoalChartDifference from './GoalChartDifference';
import { round } from 'mathjs';
import PropTypes from 'prop-types';

const GoalDifference = ({handleSave, goalCurrent: { duration, startDate, units, total, compId, tracker }}) => {
  const [record, setRecord] = useState(tracker);

  //calc time since goal started
  let time = moment().startOf('day').diff(startDate, 'days');
  let timeHours = moment().startOf('day').diff(startDate, 'hours');
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
        if (index === time + 1) {
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
      {timeHours >= 0 ? (
        <React.Fragment>
          <ul>
            <GoalChartDifference duration={duration} units={units} total={total} record={record} time={time}/>
            { time !== duration && (
              <React.Fragment>
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
              </React.Fragment>
            )}
            <li className='table-info lr-border'>
              Start Date: {moment.utc(startDate).format('MMMM Do, YYYY')}
            </li>
            <li className='table-info lr-border'>
              <div className='space-between'>
                <span>
                  Start: {record[0]} {units}
                </span>
                <span className='right'>
                  {time === duration ? `Final: ${record[0] + count} ${units}` : `Day: ${time + 1} / ${duration}`}
                </span>
              </div>
            </li>
            <li className='table-info lr-border'>
              <div className='space-between'>
                <span>
                  {progress}
                </span>
                <span className='right'>
                  Progress: {round(count / (total - record[0]) * 100)}%
                </span>
              </div>
            </li>
          </ul>
          { time !== duration && 
            <React.Fragment>
              <button className='btn btn-primary btn-block' onClick={() => handleSave(record)}>
                Save Goal
              </button>
              <p className='lr-border' />
            </React.Fragment>
          }
        </React.Fragment>
      ) : (
        <ul>
          <li className='table-info lr-border'>
            <div className='space-between'>
              <span>
                Start: {record[0]} {units}
              </span>
              <span className='right'>
                Begins {moment.utc(startDate).format('MMM Do')}
              </span>
            </div>
          </li>
          <li className='table-info lr-border'>
            <div className='space-between'>
              <span>
                Goal: {total} {units}
              </span>
              <span className='right'>
                Duration: {duration} days
              </span>
            </div>
          </li>
        </ul>
      )}
    </React.Fragment>
  )
};

GoalDifference.propTypes = {
  handleSave: PropTypes.func.isRequired,
  goalCurrent: PropTypes.object.isRequired
};

export default GoalDifference;