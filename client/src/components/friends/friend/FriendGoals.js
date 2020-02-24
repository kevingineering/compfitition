import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import FriendContext from '../../../contexts/friends/friendContext';
import GoalTable from '../../goals/list/GoalTable';

const FriendGoals = () => {
  const friendContext = useContext(FriendContext);
  const { friendCurrent, getCurrentFriendGoals, friendCurrentGoals, friendsLoading } = friendContext;

  //get friend 'friends' and 'public' goals 
  useEffect(() => {
    getCurrentFriendGoals(friendCurrent._id);
    //eslint-disable-next-line
  }, [friendCurrent])

  const [activeGoals, setActiveGoals] = useState([]);
  const [pastGoals, setPastGoals] = useState([]);
  const [activeCompetitions, setActiveCompetitions] = useState([]);
  const [pastCompetitions, setPastCompetitions] = useState([]);

  //create arrays for past and active goals and competitions
  useEffect(() => {
    //if(friendCurrentGoals.)
    let active = friendCurrentGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
    
    setActiveGoals(active.filter(goal => goal.compId === null));
    setActiveCompetitions(active.filter(goal => goal.compId !== null));

    let past = friendCurrentGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);

    setPastGoals(past.filter(goal => goal.compId === null));
    setPastCompetitions(past.filter(goal => goal.compId !== null));

  }, [friendCurrentGoals]);

  return (
    <div>
      <GoalTable
        goals={activeGoals} 
        isPast={false} 
        isGoal={true}
        isOwner={false}
        name={friendCurrent.firstName}
        loading={friendsLoading}
      />
      <GoalTable
        goals={activeCompetitions}
        isPast={false} 
        isGoal={false}
        isOwner={false}
        name={friendCurrent.firstName}
        loading={friendsLoading}
      />
      <GoalTable
        goals={pastGoals}
        isPast={true} 
        isGoal={true}
        isOwner={false}
        name={friendCurrent.firstName}
        loading={friendsLoading}
      />
      <GoalTable
        goals={pastCompetitions}
        isPast={true} 
        isGoal={false}
        isOwner={false}
        name={friendCurrent.firstName}
        loading={friendsLoading}
      />
    </div>
  )
}

export default FriendGoals;