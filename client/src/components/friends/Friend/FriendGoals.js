import React, { useContext, useState, useEffect } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import moment from 'moment';
import GoalList from '../../goals/GoalList';

const FriendGoals = () => {
  const friendContext = useContext(FriendContext);
  const { friendCurrent, getCurrentFriendGoals, friendCurrentGoals } = friendContext;

  const [isCurrentOpen, setIsCurrentOpen] = useState(true);
  const [isPastOpen, setIsPastOpen] = useState(true);

  //get friend 'friends' and 'public' goals 
  useEffect(() => {
    getCurrentFriendGoals(friendCurrent._id);
    //eslint-disable-next-line
  }, [friendCurrent])

  const [activeGoals, setActiveGoals] = useState([]);
  const [pastGoals, setPastGoals] = useState([]);

  //determine if there are active and/or past goals
  useEffect(() => {
    let tempActive = friendCurrentGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
    
    let tempPast = friendCurrentGoals.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);

    setActiveGoals(tempActive);
    setPastGoals(tempPast);
    //esLint-disable-next-line
  }, [friendCurrentGoals]);

  return (
    <div>
      <ul className='collection'>
        <li className='collection-header header-with-btn'>
          <h2>{friendCurrent.firstName}'s Current Goals</h2>
          <button 
            className='btn btn-primary right'
            onClick={() => setIsCurrentOpen(!isCurrentOpen)}
          >
            <i className={isCurrentOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
          </button>
        </li>
        {isCurrentOpen &&
          <React.Fragment>
            <GoalList goals={activeGoals} isOwner={false}/>
          </React.Fragment>
        }
      </ul>
      {pastGoals.length !== 0 && (
        <ul className='collection'>
          <li className='collection-header header-with-btn'>
            <h2>{friendCurrent.firstName}'s Past Goals</h2>
            <button 
              className='btn btn-primary right'
              onClick={() => setIsPastOpen(!isPastOpen)}
            >
              <i className={isPastOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
            </button>
          </li>
          {isPastOpen &&
            <React.Fragment>
              <GoalList goals={pastGoals} isOwner={false}/>
            </React.Fragment>
          }
        </ul>
      )}
    </div>
  )
}

export default FriendGoals;