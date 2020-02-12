import React, { useContext } from 'react';
import moment from 'moment';
import AlertContext from '../../../contexts/alerts/alertContext';

const GoalChartPassFail = ({isComplete, isOwner, isStarted, time, record, setRecord, duration, startDate, total}) => {

  const { setAlert } = useContext(AlertContext);

  //event.target will get the icon and fail, but event.currentTarget will get the button every time
  const handleClick = e => {
    if (isComplete || !isOwner) {
      return null;
    }
    let clickLoc = parseInt(e.currentTarget.name);
    if (time < clickLoc) {
      setAlert("You can't record the future.");
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
    }
  };

  //create table
  const table = () => {
    let list = [];
    for(let i = 0; i < duration / 7; i++) {
      list.push(
        <span className='table-row' key={i}>
          <span className='table-label'>Week {i + 1}
            <span className='hide-sm'>
              {''} - {moment.utc(startDate).add(7 * i, 'day').format('MMM Do')}
            </span>
          </span>
          <span className='table-buttons'>
            {buttons(i)}
          </span>
        </span>);
    }
    return list;
  };

  //create buttons for table
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
    <li>
      {table()}
    </li>
  )
}

export default GoalChartPassFail;