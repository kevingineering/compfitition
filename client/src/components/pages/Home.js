import React, { useContext, useEffect } from 'react';
import Goals from '../goals/Goals';
import Friends from '../friends/Friends';
import GoalContext from '../../contexts/goals/goalContext';

const Home = () => {
  const goalContext = useContext(GoalContext);
  const { clearCurrentGoal } = goalContext;

  useEffect(() => {
    clearCurrentGoal();
    //eslint-disable-next-line
  }, []);
  
  return (
    <div className='grid-2'>
      <Goals/>
      <Friends/>
    </div>
  )
};

export default Home;