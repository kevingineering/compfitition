import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GoalContext from '../../contexts/goals/goalContext';

const GoalItem = ({goal: { id, name, duration, startDate }}) => {
  const goalContext = useContext(GoalContext);
  const { deleteGoal } = goalContext;

  const handleDelete = () => {
    deleteGoal(id);
  }

  return (
    <li className='collection-item'>
      <h6>
        <Link to={`/goal/${id}`}>{name}</Link>
      </h6>
      <p>
        Start Date: {startDate}
      </p>
      <p>
        Duration: {duration} days
      </p>
      <button onClick={handleDelete} >Delete</button>
    </li>
  )
};

GoalItem.propTypes = {
  goal: PropTypes.object.isRequired
}

export default GoalItem;