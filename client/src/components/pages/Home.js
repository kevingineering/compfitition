import React, { useContext, useEffect } from 'react';
import Goals from '../goals/list/Goals';
import Friends from '../friends/user/Friends';
import GoalContext from '../../contexts/goals/goalContext';
import CompetitionContext from '../../contexts/competitions/competitionContext';
import Notifications from '../letters/Notifications';

const Home = () => {

 //console.log{'Home')

  const goalContext = useContext(GoalContext);
  const { clearCurrentGoal } = goalContext;

  const competitionContext = useContext(CompetitionContext);
  const { clearCompetition } = competitionContext;

  useEffect(() => {
    clearCurrentGoal();
    clearCompetition();
    //eslint-disable-next-line
  }, []);
  
  return (
    <div className='grid-2'>
      <Goals/>
      <div>
        <Notifications/>
        <Friends/>
      </div>
    </div>
  )
};

export default Home;