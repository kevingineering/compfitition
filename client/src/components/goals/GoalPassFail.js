import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import AlertContext from '../../contexts/alerts/alertContext';
import { round } from 'mathjs';
import PropTypes from 'prop-types';

const GoalPassFail = ({handleSave, current: { duration, startDate, total, compId, tracker }}) => {
  const alertContext = useContext(AlertContext);
  const {setAlert, clearAlerts} = alertContext;

  const [record, setRecord] = useState(tracker);

  let time = moment().startOf('day').diff(startDate, 'days');
  let isComplete = false;
  if (time > duration) {
    time = duration;
    isComplete = true;
  }

  useEffect(() => {
    setRecord(record.map((value, index) => {
      if (index < time && value === null) {
        value = false;
      }
      return value;
    }));
    //eslint-disable-next-line
  }, []);

  //clear alerts before redirect
  useEffect(() => {
    return () => {
      clearAlerts();
    }
    //eslint-disable-next-line
  }, []);

  let success = 0;

  for (let i = 0; i < record.length; i++ ) {
    if (record[i] === true) 
      success++;
  }

  let toDatePercentage = round(success / (time + 1) * 100);
  let totalPercentage = round(success / record.length * 100);

  //event.target will get the icon and fail, but event.currentTarget will get the button every time
  const handleClick = e => {
    if (isComplete) {
      return null;
    }
    let clickLoc = parseInt(e.currentTarget.name);
    if (time < clickLoc) {
      setAlert("You can't record the future.");
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
    else if (time === clickLoc || time === clickLoc + 1) {
      setRecord(record.map((value, index) => {
        if (index === clickLoc) {
          if (value === null || value === false) {
            value = true;
          }
          else value = false;
        }
        return value;
      }))
    }
    else {
      setAlert("You can only record data for today and yesterday.");
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
  };

  const table = () => {
    let list = [];
    for(let i = 0; i < duration / 7; i++) {
      list.push(
        <span className='table-row' key={i}>
          <h3 className='table-label'>Week {i + 1}
            <span className='hide-sm'>
              {''} - {moment.utc(startDate).add(7 * i, 'day').format('MMM Do')}
            </span>
          </h3>
          <span className='table-buttons'>
            {buttons(i)}
          </span>
        </span>);
    }
    return list;
  };

  const buttons = week => {
    let list = [];
    for(let i = 0; i < total; i++) {
      let loc = week * total + i;
      list.push(
        <button 
          className={`table-btn ${time === loc && 'table-btn-today'}`}
          onClick={handleClick} 
          key={loc} 
          name={loc} 
        >
          {record[loc] && <i className='fas fa-check success-color' name={loc}/>}
          {!record[loc] && record[loc] !== null && <i className='fas fa-times danger-color' name={loc}/>}
          {record[loc] === null && ' '}
        </button>
      )
    }
    return list;
  };

  return (
    <React.Fragment>
      <ul>
        <li>
          {table()}
        </li>
        <li className='table-info lr-border'>
          Start Date: {moment.utc(startDate).format('MMMM Do, YYYY')}
        </li>
        {!isComplete && time >= 0 &&
          <li className='table-info lr-border'>
            Success To Date: {success} / {time > duration ? record.length : time + 1} ({toDatePercentage}%)
          </li>
        }
        <li className='table-info lr-border'>
          Success Total: {success} / {record.length} ({totalPercentage}%)
        </li>
      </ul>
      {!isComplete &&
        <button className='btn btn-primary btn-block' onClick={() => handleSave(record)}>
          Save Goal
        </button>
      }
    </React.Fragment>
  );
};

GoalPassFail.propTypes = {
  handleSave: PropTypes.func.isRequired,
  current: PropTypes.object.isRequired
}

export default GoalPassFail;