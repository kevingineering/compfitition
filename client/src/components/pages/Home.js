import React, { useContext, useEffect } from 'react';
import Goals from '../goals/Goals';
import Friends from '../friends/Friends';
import GoalContext from '../../contexts/goals/goalContext';

const Home = () => {
  const goalContext = useContext(GoalContext);
  const { clearCurrent } = goalContext;

  useEffect(() => {
    clearCurrent();
    //eslint-disable-next-line
  }, []);
  
  return (
    <div className='grid-2'>
      <div>
        <Goals/>
      </div>
      <div>
        <Friends/>
      </div>
    </div>
  )
};

export default Home;