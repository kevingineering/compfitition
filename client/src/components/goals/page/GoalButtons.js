import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import GoalContext from '../../../contexts/goals/goalContext';
import AlertContext from '../../../contexts/alerts/alertContext';

const GoalButtons = ({isStarted, isActive, isOwner, handleSave, record}) => {

 //console.log{'GoalButtons')

  const { 
    goalCurrent, 
    clearCurrentGoal, 
    goalsError, 
    deleteGoal, 
    clearGoalsError
  } = useContext(GoalContext);

  const { setAlert, clearAlert } = useContext(AlertContext);

  const [deleteToggle, setDeleteToggle] = useState(false);

  let history = useHistory();

  const handleDelete = async () => {
    await deleteGoal(goalCurrent._id);
    if (goalsError) {
      setAlert(goalsError);
      clearGoalsError();
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
            className='btn btn-block btn-primary' 
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
            className='btn btn-block btn-primary center' 
            onClick={clearAlert}
          >
            Modify Goal
          </Link>
          <p className='lr-border'/>
        </React.Fragment>
      }
      {/* Delete Button */}
      {!deleteToggle &&
        <React.Fragment>
          <button 
            className='btn btn-block btn-primary' 
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

GoalButtons.propTypes = {
  isStarted: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  record: PropTypes.array.isRequired
}

export default GoalButtons;