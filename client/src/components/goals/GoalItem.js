import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import GoalContext from '../../contexts/goals/goalContext';

const GoalItem = ({goal: { _id, name, startDate, duration }}) => {
  const goalContext = useContext(GoalContext);
  const { setCurrent } = goalContext;

  let time = moment().startOf('day').diff(startDate, 'days') + 1;
  if (time < 0)
    time = 0;
  else if (time > duration)
    return null;

  const handleClick = () => {
    setCurrent(_id);
  }

  return (
    <li className='collection-item'>
      <div className='flex'>
        <h3 className='vertical-center'>
          <Link onClick={handleClick} to={`/goal/${_id}`}>{name}</Link>
        </h3>
      </div>
      <div>
        <span className='right'>Day: {time} / {duration}</span>
        <br/>
        <span className='right'>100%</span>
      </div>
    </li>
  );
};

GoalItem.propTypes = {
  goal: PropTypes.object.isRequired
}

export default GoalItem;