import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import GoalContext from '../../contexts/goals/goalContext';

const GoalItem = ({goal: { _id, name, startDate, duration, tracker, type, units }}) => {
  const goalContext = useContext(GoalContext);
  const { setCurrent } = goalContext;

  let time = moment().startOf('day').diff(startDate, 'days');

  //calc progress
  let progress = '';
  let count = 0;
  if (type === 'pass/fail'){
    for (let i = 0; i < tracker.length; i++) {
      if (tracker[i]) count++;
    }
    progress = `Success: ${count} / ${(time > tracker.length) ? tracker.length : time + 1}`
  }
  else if (type === 'total') {
    for (let i = 0; i < tracker.length; i++) {
      count += tracker[i];
    }
    progress = `Total: ${count} ${units}`
  }
  else {
    let temp = tracker.filter(value => value !== null)
    let count = temp.pop() - tracker[0];
    progress = `Change: ${count > 0 ? '+' : ''}${count} ${units}`
  }

  const handleClick = () => {
    setCurrent(_id);
  };

  return (
    <li className='collection-item'>
      <div className='flex'>
        <h3 className='vertical-center'>
          <Link onClick={handleClick} to={`/goal/${_id}`}>{name}</Link>
        </h3>
      </div>
      {time < duration + 1 ? (
        <div className='hide-sm'>
          {time >= 0 ? (
          <React.Fragment>
            <span className='right'>Day: {time + 1} / {duration}</span>
            <br/>
            <span className='right'>{progress}</span>
          </React.Fragment>
          ) : (
          <React.Fragment>
            <span className='right'>Begins </span>
            <br/>
            <span className='right'>{moment.utc(startDate).format('MMM Do')}</span>
          </React.Fragment>
          )}
        </div>
      ) : (
        <span className='right hide-sm'>Final {progress}</span>
      )
      }
    </li>
  );
};

GoalItem.propTypes = {
  goal: PropTypes.object.isRequired
}

export default GoalItem;