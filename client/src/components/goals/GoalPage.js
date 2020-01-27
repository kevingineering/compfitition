import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';
import GoalPassFail from './GoalPassFail';
import GoalTotal from './GoalTotal';
import GoalDifference from './GoalDifference';
import moment from 'moment';

const GoalPage = props => {
  const goalContext = useContext(GoalContext);
  const { current, clearCurrent, error, deleteGoal, updateGoalTracker } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlerts } = alertContext;

  const [deleteToggle, setDeleteToggle] = useState(false);

  const { name, _id, type, startDate, duration } = current;
  !Object.entries(current).length && props.history.push('/');

  let time = moment().startOf('day').diff(startDate, 'days');

  //clear alerts before redirect
  useEffect(() => {
    return () => {
      clearAlerts();
    }
  }, []);
  
  const handleDelete = async () => {
    await deleteGoal(_id);
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

  const handleSave = async (record) => {
    await updateGoalTracker(record, _id);
    if (error) {
      setAlert(error);
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
    else {
      setAlert('Goal saved!');
      setTimeout(() => {
        clearAlerts();
      }, 2000);
    }
  }

  return (
    <div className='form-container'>
    {!Object.entries(current).length ? (
      <h2>Loading...</h2>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        {type === 'pass/fail' && <GoalPassFail current={current} handleSave={handleSave}/>}
        {type === 'total' && <GoalTotal current={current} handleSave={handleSave}/>}
        {type === 'difference' && <GoalDifference current={current} handleSave={handleSave}/>}
        {time <= duration &&
          <React.Fragment>
            <p className='lr-border'/>
            <Link 
              to='/goalform' 
              className='btn btn-primary btn-block center' 
              onClick={clearAlerts}
            >
              Modify Goal
            </Link>
          </React.Fragment>
        }
        {!deleteToggle &&
          <React.Fragment>
            <p className='lr-border'/>
            <button 
              className='btn btn-primary btn-block' 
              onClick={() => setDeleteToggle(true)}
            >
              Delete Goal
            </button>
          </React.Fragment>
        }
        {/*Delete module*/}
        {deleteToggle && (
          <React.Fragment>
            <span className='alert lr-border'>
              Are you sure you want to delete this goal? Deletions cannot be undone.
            </span>
            <button
              className='btn btn-danger btn-split'
              onClick={handleDelete}
            >Yes</button>
            <button
              className='btn btn-primary btn-split'
              onClick={() => setDeleteToggle(false)}
            >No</button>
          </React.Fragment>
        )}
      </React.Fragment>
    )}
    </div>
  )
}

export default GoalPage;