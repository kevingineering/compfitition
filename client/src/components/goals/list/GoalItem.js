import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import GoalContext from '../../../contexts/goals/goalContext';
import FriendContext from '../../../contexts/friends/friendContext';
import CompetitionContext from '../../../contexts/competitions/competitionContext';
import { getTime } from '../../sharedFunctions';

const GoalItem = ({isOwner, isGoal, goal: { _id, name, startDate, duration, tracker, type, units, compId }}) => {

 //console.log{'GoalItem')

  const { setCurrentGoal } = useContext(GoalContext);
  const { setCurrentFriendGoal, friendCurrent } = useContext(FriendContext);
  const { getCompetition, getCompetitionCurrentGoal } = useContext(CompetitionContext);

  const [isStarted, time, isComplete] = getTime(startDate, duration);

  //calc progress
  let progressTag = '';
  let progressMsg = '';
  let count = 0;
  if (type === 'pass/fail'){
    for (let i = 0; i < tracker.length; i++) {
      if (tracker[i]) count++;
    }
    progressTag = 'Success: '
    progressMsg = `${count} / ${isComplete ? tracker.length : time + 1}`
  }
  else if (type === 'total') {
    for (let i = 0; i < tracker.length; i++) {
      count += tracker[i];
    }
    progressTag = 'Total: '
    progressMsg = `${count} ${units}`
  }
  else {
    let temp = tracker.filter(value => value !== null)
    let count = temp.pop() - tracker[0];
    progressTag = 'Change: '
    progressMsg = `${count > 0 ? '+' : ''}${count} ${units}`
  }

  const handleClick = async () => {
    isOwner ? setCurrentGoal(_id) : setCurrentFriendGoal(_id);
    !isGoal && await getCompetition(compId);
    !isGoal && !isOwner && await getCompetitionCurrentGoal(compId, friendCurrent._id)
  };

  return (
    <li className='collection-item'>
      <div className='flex'>
        <h3 className='vertical-center'>
          <Link 
            onClick={handleClick} 
            to={isGoal ? (
                isOwner ? '/goal' : '/friend/goal'
              ) : (
                '/competition'
            )}>
            {name}
          </Link>
        </h3>
      </div>
      {!isComplete ? (
        <div className='hide-sm'>
          {isStarted ? (
          <React.Fragment>
            <span className='right'>
              <strong>Day: </strong>{time + 1} / {duration}
            </span>
            <br/>
            <span className='right'>
              <strong>{progressTag}</strong>{progressMsg}
            </span>
          </React.Fragment>
          ) : (
          <React.Fragment>
            <span className='right'>Begins </span>
            <br/>
            <span className='right'>
              {moment.utc(startDate).format('MMM Do')}
            </span>
          </React.Fragment>
          )}
        </div>
      ) : (
        <span className='right hide-sm'>
          <strong>Final {progressTag}</strong>{progressMsg}</span>
      )
      }
    </li>
  );
};

GoalItem.propTypes = {
  goal: PropTypes.object.isRequired,
  isGoal: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired
}

export default GoalItem;