import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import GoalContext from '../../contexts/goals/goalContext';
import AlertContext from '../../contexts/alerts/alertContext';
import GoalPassFail from './GoalPassFail';
import GoalTotal from './GoalTotal';
import GoalDifference from './GoalDifference';
import moment from 'moment';

const GoalPage = props => {
  const goalContext = useContext(GoalContext);
  const { goalCurrent, clearCurrentGoal, goalsError, deleteGoal, updateGoalTracker } = goalContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  const [deleteToggle, setDeleteToggle] = useState(false);

  const { name, _id, type, startDate, duration } = goalCurrent;
  !Object.entries(goalCurrent).length && props.history.push('/');

  let time = moment().startOf('day').diff(startDate, 'days');
  
  const handleDelete = async () => {
    await deleteGoal(_id);
    if (goalsError) {
      setAlert(goalsError);
    }
    else {
      setAlert('Goal deleted!', true);
      props.history.push('/');
      clearCurrentGoal();
    }
  };

  const handleSave = async (record) => {
    await updateGoalTracker(record, _id);
    if (goalsError) {
      setAlert(goalsError);
    }
    else {
      setAlert('Goal saved!');
    }
  }

  return (
    <div className='form-container'>
    {!Object.entries(goalCurrent).length ? (
      <h2>Loading...</h2>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        {type === 'pass/fail' && 
          <GoalPassFail goal={goalCurrent} handleSave={handleSave} isOwner={true}/>}
        {type === 'total' && 
          <GoalTotal goal={goalCurrent} handleSave={handleSave} isOwner={true}/>}
        {type === 'difference' && 
          <GoalDifference goal={goalCurrent} handleSave={handleSave} isOwner={true}/>}
        {time <= duration &&
          <React.Fragment>
            <Link 
              to='/goalform' 
              className='btn btn-primary btn-block center' 
              onClick={clearAlert}
            >
              Modify Goal
            </Link>
            <p className='lr-border'/>
          </React.Fragment>
        }
        {!deleteToggle &&
          <React.Fragment>
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
            <hr/>
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