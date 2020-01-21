import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import GoalItem from './GoalItem';

const Goals = () => {
  const goalContext = useContext(GoalContext);
  const { getUserGoals, userGoals, loading } = goalContext;

  useEffect(() => {
    getUserGoals();
    //eslint-disable-next-line
  }, []);

  let listItems = null;

  if (loading)
    listItems = (
      <li className='collection-item'>
        <h6>Loading...</h6>
      </li>
    )
  else if (userGoals !== null && userGoals.length === 0 && !loading) {
    listItems = (
      <li className='collection-item center'>
        You have no saved goals. Add one!
      </li>
    );
  }
  else {
    listItems = (
      <React.Fragment>
        {userGoals && userGoals.map(goal => <GoalItem goal={goal} key={goal._id} />)}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ul className='collection'>
        <li className='collection-header'>
          <h1 className='collection-header'>Current Goals</h1>
        </li>
        {listItems}
        <li className='collection-footer'>
          <Link to='/goalform' className='text-secondary'>
            <p><i className='fas fa-plus'/> Add Goal</p>
          </Link>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default Goals;