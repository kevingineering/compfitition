import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import GoalItem from './GoalItem';
import moment from 'moment';

const Goals = () => {
  const goalContext = useContext(GoalContext);
  const { getUserGoals, goalsOfUser, goalsLoading } = goalContext;
  
  const [activeGoals, setActiveGoals] = useState([]);
  const [pastGoals, setPastGoals] = useState([]);
  const [isCurrentOpen, setIsCurrentOpen] = useState(true);
  const [isPastOpen, setIsPastOpen] = useState(true);

  useEffect(() => {
    getUserGoals();
    //eslint-disable-next-line
  }, []);

  //determine if there are active and/or past goals
  useEffect(() => {
    let tempActive = goalsOfUser.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
    
    let tempPast = goalsOfUser.filter(goal => 
      (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);

    setActiveGoals(tempActive);
    setPastGoals(tempPast);
  }, [goalsOfUser]);

  //active goals
  let activeItems = null;

  if (goalsLoading) {
    activeItems = (
      <li className='collection-item'>
        Loading...
      </li>
    )
  }
  else if (activeGoals.length === 0) {
    activeItems = (
      <li className='collection-item center collection-item-block'>
        <p className='width-250'>
          You have no goals... 
          <br/>
          I'm not judging, but you should add a few to make us both feel better.
        </p>
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
    <div>
      <ul className='collection'>
        <li className='collection-header header-with-btn'>
          <h2>Current Goals</h2>
          <button 
            className='btn btn-primary right'
            onClick={() => setIsCurrentOpen(!isCurrentOpen)}
          >
            <i className={isCurrentOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
          </button>
        </li>
        {isCurrentOpen &&
          <React.Fragment>
            {activeItems}
            <li className='collection-footer'>
              <Link to='/goalform' className='text-secondary'>
                <p className='margin-025'><i className='fas fa-plus'/> Add Goal</p>
              </Link>
            </li>
          </React.Fragment>
        }
      </ul>
      {pastGoals.length !== 0 && (
        <ul className='collection'>
          <li className='collection-header header-with-btn'>
            <h2>Past Goals</h2>
            <button 
              className='btn btn-primary right'
              onClick={() => setIsPastOpen(!isPastOpen)}
            >
              <i className={isPastOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
            </button>
          </li>
          {isPastOpen &&
            <React.Fragment>
              {pastItems}
            </React.Fragment>
          }
        </ul>
      )}
    </div>
  );
};



export default Goals;