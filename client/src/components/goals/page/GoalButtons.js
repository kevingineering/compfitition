import React, { useState, useContext } from 'react';
import GoalContext from '../../../contexts/goals/goalContext';
import AlertContext from '../../../contexts/alerts/alertContext';
import { Link, useHistory } from 'react-router-dom';

const GoalButtons = ({isStarted, isActive, isOwner, handleSave, record}) => {

  const { 
    goalCurrent, 
    clearCurrentGoal, 
    goalsError, 
    deleteGoal, 
  } = useContext(GoalContext);

  const { setAlert, clearAlert } = useContext(AlertContext);

  const [deleteToggle, setDeleteToggle] = useState(false);

  let history = useHistory();

  const handleDelete = async () => {
    await deleteGoal(goalCurrent._id);
    if (goalsError) {
      setAlert(goalsError);
    }
    else {
      setAlert('Goal deleted!', true);
      history.push('/');
      clearCurrentGoal();
    }
  };

  return (
    <React.Fragment>
      {/* SaveButton */}
      { isStarted && isOwner && isActive &&
        <React.Fragment>
          <button 
            className='btn btn-primary btn-block' 
            onClick={() => handleSave(record)}
          >
            Save Goal
          </button>
          <p className='lr-border' />
        </React.Fragment>
      }
      {/* Modify Button */}
      { isActive &&
        <React.Fragment>
          <Link 
            to='/goalform' 
            className='btn btn-primary btn-block center' 
            onClick={clearAlert}
          >
            Modify Goal
          </Link>
        </React.Fragment>
      }
      {/* Delete Button */}
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
          <hr/>
          <span className='alert lr-border'>
            Are you sure you want to delete this goal? Deletions cannot be undone.
          </span>
          <button
            className='btn btn-primary btn-split'
            onClick={() => setDeleteToggle(false)}
          >No</button>
          <button
            className='btn btn-danger btn-split'
            onClick={() => handleDelete()}
          >Yes</button>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default GoalButtons;