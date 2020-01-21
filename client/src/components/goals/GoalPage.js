import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';

const GoalPage = props => {
  const goalContext = useContext(GoalContext);
  const { current, clearCurrent, error, deleteGoal } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlerts } = alertContext;

  const { name, _id } = current;
  !Object.entries(current).length && props.history.push('/');

  //https://canvasjs.com/react-charts/line-chart/

  const handleDelete = () => {
    deleteGoal(_id);
    if (error) {
      setAlert(error);
    }
    else {
      setAlert('Goal deleted!');
      props.history.push('/');
      clearCurrent();
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
  };

  return (
    <div>
    {!Object.entries(current).length ? (
      <h1>Loading...</h1>
    ) : (
    <div>
      <h1>{name}</h1>
      <Link to='/goalform' className='btn btn-primary' onClick={clearAlerts}>
        Modify
      </Link>
      <button className='btn btn-primary' onClick={handleDelete}>
        Delete
      </button>
    </div>
    )}
    </div>
  )
}

export default GoalPage;