import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import GoalProgress from './GoalProgress';
import GoalInfo from './GoalInfo';
import GoalButtons from './GoalButtons';
import AlertContext from '../../../contexts/alerts/alertContext';
import GoalContext from '../../../contexts/goals/goalContext';
import GoalChart from './GoalChart';

const GoalPage = () => {
  const { goalCurrent, goalsError, updateGoalTracker } = useContext(GoalContext);
  const { setAlert, clearAlert } = useContext(AlertContext);

  const { name, duration, startDate, units, tracker, type, _id } = goalCurrent;
 
  const [record, setRecord] = useState(tracker);

  let history = useHistory();

  !Object.entries(goalCurrent).length && history.push('/');

  //clear alert before redirect
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, []);

  //fill missed past values in tracker array
  useEffect(() => {
    if (type === 'pass/fail') {
      setRecord(record.map((value, index) => {
        if (index < time && value === null) {
          value = false;
        }
        return value;
      }));
    }
    //eslint-disable-next-line
  }, []);

  //decide if competition has started, is over, or what day we are on
  let timeHours = moment().startOf('day').diff(startDate, 'hours');
  const isStarted = timeHours >= 0 ? true : false;
  let time = moment().startOf('day').diff(startDate, 'days');
  if (time > duration)
    time = duration;
  const isComplete = time === duration ? true : false;

  //calc goal value
  let value = 0;
  if (type === 'difference') {
    let temp = record.filter(value => value !== null)
    value = temp.pop() - record[0];
  } else if (type === 'total') {
    for (let i = 0; i < record.length; i++ ) {
      value += record[i];
    }
  } else if (type === 'pass/fail') {
    for (let i = 0; i < record.length; i++ ) {
      if (record[i] === true) 
        value++;
    }
  }

  const handleSave = async (record) => {
    await updateGoalTracker(record, _id);
    if (goalsError) {
      setAlert(goalsError);
    }
    else {
      setAlert('Goal saved!');
    }
  }
  
  let isOwner = true;

  return (
    <div className='form-container'>
    {!Object.entries(goalCurrent).length ? (
      <h2>Loading...</h2>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        <ul>
          {isStarted && 
            <GoalChart 
              goal={goalCurrent}
              record={record}
              setRecord={setRecord} 
              time={time}
              isComplete={isComplete}
              isOwner={isOwner}
              isStarted={isStarted}
            />
          }
          {isStarted && !isComplete && type !== 'pass/fail' &&
            <GoalProgress 
              type={type}
              time={time}
              record={record}
              setRecord={setRecord}
              units={units}
            />
          }
          <GoalInfo 
            goal={goalCurrent}
            record={record}
            time={time}
            value={value}
            isStarted={isStarted}
          />
        </ul>
        <GoalButtons 
          isStarted={isStarted}
          isActive={time < duration} 
          isOwner={isOwner}
          handleSave={handleSave}
          record={record}
        />
      </React.Fragment>
    )}
    </div>
  )
};

export default GoalPage;