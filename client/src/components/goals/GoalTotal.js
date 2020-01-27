import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
//import AlertContext from '../../contexts/alerts/alertContext';
import GoalChart from './GoalChart';
import { round } from 'mathjs';

const GoalTotal = ({handleSave, current: { duration, startDate, units, total, compId, tracker }}) => {
  //const alertContext = useContext(AlertContext);
  //const {setAlert, clearAlerts} = alertContext;

  const [record, setRecord] = useState(tracker);

  let runningTotal = 0;

  for (let i = 0; i < record.length; i++ ) {
    runningTotal += record[i];
  }

  useEffect(() => {
    setRecord(record.map(value => {
      if (value === null) {
        value = 0;
      }
      return value;
    }));
    //eslint-disable-next-line
  }, []);

  let time = moment().startOf('day').diff(startDate, 'days');
  if (time > duration)
    time = duration;

  const [today, setToday] = useState(record[time]);
  const [yesterday, setYesterday] = useState(record[time - 1]);

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
        <GoalChart duration={duration} units={units} total={total} record={record} time={time}/>
        <li className='table-info lr-border center'>
          <strong>Record Your Progress</strong>
        </li>
        <li className='table-info lr-border center'>
          <div className="space-between width-200">
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
          </div>
        </li>
        <li className='table-info lr-border'>
          <div className="space-between width-200">
            <span>
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
          </div>
        </li>
        <hr/>
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              Total: {runningTotal} / {total} {units}
            </span>
            <span>
              Day: {time + 1} / {duration}
            </span>
          </div>
        </li>
        <li className='table-info lr-border'>You are {round(runningTotal / total * 100)}% finished with your goal.</li>
      </ul>
      <button className='btn btn-primary btn-block' onClick={() => handleSave(record)}>
        Save Goal
      </button>
    </React.Fragment>
  )
}

export default GoalTotal;