import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import GoalItem from './GoalItem';
import GoalForm from '../goals/GoalForm'

const Goals = () => {
  const goalContext = useContext(GoalContext);
  const { getGoals, goals, loading } = goalContext;

  useEffect(() => {
    getGoals();
    //eslint-disable-next-line
  }, []);

  if (goals !== null && goals.length === 0 && !loading) {
    return <h4>Add a goal!</h4>
  };

  return (
    <React.Fragment>
      
      <ul className='collection with-header'>
        <li className='collection-header center indigo white-text'>
          <h5 className='no-margin'>Current Goals</h5>
        </li>
        {goals === null ? <h4>Loading...</h4> : (
          goals.map(goal => <GoalItem goal={goal} key={goal.id} />)
        )}
        <li className='collection-header center indigo'>
          <Link to='/newgoal'>
            <h6 className='white-text'>+ Add Goal</h6>
          </Link>
        </li>
      </ul>
      <GoalForm />
    </React.Fragment>
  )
}

export default Goals;