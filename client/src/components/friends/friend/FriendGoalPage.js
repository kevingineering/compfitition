import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GoalInfo from '../../goals/page/GoalInfo';
import FriendContext from '../../../contexts/friends/friendContext';
import GoalChart from '../../goals/page/GoalChart';
import { getTime } from '../../sharedFunctions';

const FriendGoalPage = () => {

 //console.log{'FriendGoalPage')

  const { friendCurrentGoal } = useContext(FriendContext);

  const { name, duration, startDate, tracker, type } = friendCurrentGoal;
 
  const [record, setRecord] = useState(tracker);

  let history = useHistory();
  !Object.entries(friendCurrentGoal).length && history.goBack();

  //fill missed past values in tracker array - will not be saved
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
  const [isStarted, time, isComplete] = getTime(startDate, duration);

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
  
  let isOwner = false;

  return (
    <div className='form-container'>
    {!Object.entries(friendCurrentGoal).length ? (
      <div className="spinner"/>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        <ul>
          {isStarted && 
            <GoalChart 
              goal={friendCurrentGoal}
              record={record}
              setRecord={setRecord} 
              time={time}
              isComplete={isComplete}
              isOwner={isOwner}
              isStarted={isStarted}
            />
          }
          <GoalInfo 
            goal={friendCurrentGoal}
            record={record}
            time={time}
            value={value}
            isStarted={isStarted}
          />
        </ul>
        <hr/>
      </React.Fragment>
    )}
    </div>
  )
};

export default FriendGoalPage;