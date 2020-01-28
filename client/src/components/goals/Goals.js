import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import GoalItem from './GoalItem';
import moment from 'moment';

const Goals = () => {
  const goalContext = useContext(GoalContext);
  const { getUserGoals, userGoals, loading } = goalContext;
  
  const [activeGoals, setActiveGoals] = useState([]);
  const [pastGoals, setPastGoals] = useState([]);

  useEffect(() => {
    getUserGoals();
    //eslint-disable-next-line
  }, []);

  //determine if there are active and/or past goals
  useEffect(() => {
    let tempActive = userGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
    
    let tempPast = userGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);

    setActiveGoals(tempActive);
    setPastGoals(tempPast);
  }, [userGoals]);

  //active goals
  let activeItems = null;

  if (loading) {
    activeItems = (
      <li className='collection-item'>
        <h6>Loading...</h6>
      </li>
    )
  }
  else if (activeGoals.length === 0) {
    const message = 'You have no goals :(';
    activeItems = (
      <li className='collection-item center collection-item-block'>
        {message}
        <br/>
        I'm sure that's not true, add your goals here!
      </li>
    );
  }
  else {
    activeItems = (
      <React.Fragment>
        {activeGoals.map(goal => <GoalItem goal={goal} key={goal._id} />)}
      </React.Fragment>
    );
  }

  //past goals
  let pastItems = null;

  if (pastGoals.length !== 0) {
    pastItems = (
      <React.Fragment>
        {pastGoals.map(goal => <GoalItem goal={goal} key={goal._id} />)}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ul className='collection'>
        <li className='collection-header'>
          <h2>Current Goals</h2>
        </li>
        {activeItems}
        <li className='collection-footer'>
          <Link to='/goalform' className='text-secondary'>
            <p><i className='fas fa-plus'/> Add Goal</p>
          </Link>
        </li>
      </ul>
      {pastGoals.length !== 0 && 
        <ul className='collection'>
          <li className='collection-header'>
            <h2>Past Goals</h2>
          </li>
          {pastItems}
        </ul>
      }
    </React.Fragment>
  );
};

export default Goals;