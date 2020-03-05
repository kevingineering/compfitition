import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GoalProgress = ({type, time, record, setRecord, units}) => {

  //first value of difference array is start value, so we need to add one to get the current day's value
  let day = time;
  if (type === 'difference')
    day = time + 1;
  
  //state for controlled variables
  const [today, setToday] = useState(record[day]);
  const [yesterday, setYesterday] = useState(record[time - 1]);

  //if value is less than zero, null
  //if value is empty ('') and type === 'difference' do not record
  //if value is empty ('') and type === 'total' set zero in array
  //otherwise set value in array
  //diffence tracks only today, total tracks today and yesterday
  const handleChange = e => {
    if (e.target.value < 0)
      return null;
    if (e.target.name === 'today') {
      setToday(e.target.value);
      if (type === 'difference')
        setRecord(record.map((value, index) => {
          if (index === time + 1) {
            if (e.target.value === '')
              return null;
            value = parseFloat(e.target.value);
          }
          return value;
        }));
      else if (type === 'total')
        setRecord(record.map((value, index) => {
          if (index === time) {
            if (e.target.value === '')
              value = 0;
            else value = parseFloat(e.target.value);
          }
        return value;
      }));
    } 
    else {
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
      <li className='table-info lr-border center'>
        <strong>Record Your Progress</strong>
      </li>
      <li className='table-info lr-border center'>
        <span className='width-75'>
          <strong>Today:</strong>
        </span>
        <span>
          <input 
            className='center'
            id='chart-input'
            type='number' 
            value={today === null ? '' : today} 
            name='today' 
            onChange={handleChange}
            min='0'
            max='1000000'
          />
          {units}
        </span>
      </li>
      {time > 0 && type === 'total' && 
        <React.Fragment>
          <li className='table-info lr-border center'>
            <span className='width-75'>
              <strong>Yesterday:</strong>
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
                max='1000000'
              />
              {units}
            </span>
          </li>
        </React.Fragment>
      }
      <hr/>
    </React.Fragment>
  )
}

GoalProgress.propTypes = {
  type: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  record: PropTypes.array.isRequired,
  setRecord: PropTypes.func.isRequired,
  units: PropTypes.string.isRequired
}

export default GoalProgress;