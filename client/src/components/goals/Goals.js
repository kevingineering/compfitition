import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import GoalList from './GoalList';
import moment from 'moment';

const Goals = () => {
  const goalContext = useContext(GoalContext);
  const { getGoals, goals } = goalContext;
  
  const [isCurrentOpen, setIsCurrentOpen] = useState(true);
  const [isPastOpen, setIsPastOpen] = useState(true);

  useEffect(() => {
    getGoals();
    //eslint-disable-next-line
  }, []);

  const [activeGoals, setActiveGoals] = useState([]);
  const [pastGoals, setPastGoals] = useState([]);

    //determine if there are active and/or past goals
    useEffect(() => {
      let tempActive = goals.filter(goal => 
        (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
      
      let tempPast = goals.filter(goal => 
        (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);
  
      setActiveGoals(tempActive);
      setPastGoals(tempPast);
    }, [goals]);

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
            <GoalList goals={activeGoals} isOwner={true}/>
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
              <GoalList goals={pastGoals} isOwner={true}/>
            </React.Fragment>
          }
        </ul>
      )}
    </div>
  );
};

export default Goals;