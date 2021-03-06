import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import CompetitionContext from '../../../../contexts/competitions/competitionContext'
import GoalContext from '../../../../contexts/goals/goalContext'
import AlertContext from '../../../../contexts/alerts/alertContext'

const CompButtons = ({isAdmin, isAdminView, isOwner, isStarted, isActive, handleSave, record}) => {

 //console.log{'CompButtons')

  const { 
    competition, 
    competitionError, 
    deleteCompetition,
    removeUserFromCompetition,
    clearCompetition,
    clearCompetitionError
  } = useContext(CompetitionContext)

  const { clearCurrentGoal } = useContext(GoalContext)

  const { setAlert, clearAlert } = useContext(AlertContext)

  const [deleteToggle, setDeleteToggle] = useState(false)
  const [leaveToggle, setLeaveToggle] = useState(false)

  let history = useHistory()

  const afterHandle = (verb) => {
    if (competitionError) {
      setAlert(competitionError)
      clearCompetitionError()
    }
    else {
      setAlert(`You have ${verb} the competition!`, true)
      history.push('/')
      clearCurrentGoal()
      clearCompetition()
    }
  }

  //handleDelete
  const handleDelete = async () => {
    await deleteCompetition(competition._id)
    afterHandle('deleted')
  }

  const handleLeave = async () => {
    await removeUserFromCompetition(competition._id)
    afterHandle('left')
  }

  return (
    <React.Fragment>
      {/* SaveButton */}
      { isStarted && isOwner &&
        <React.Fragment>
          <button 
            className='btn btn-block btn-primary' 
            onClick={() => handleSave(record)}
          >
            Save Progress
          </button>
        </React.Fragment>
      }
      {/* Modify Button */}
      { isActive && isAdminView && 
        <React.Fragment>
          <p className='lr-border' />
          <Link 
            to='/competitionform' 
            className='btn btn-block btn-primary center' 
            onClick={clearAlert}
          >
            Modify Competition
          </Link>
        </React.Fragment>
      }
      {/* Delete Button */}
      {!deleteToggle && isAdminView && 
        <React.Fragment>
          <p className='lr-border'/>
          <button 
            className='btn btn-block btn-primary' 
            onClick={() => setDeleteToggle(true)}
          >
            Delete Competition
          </button>
        </React.Fragment>
      }
      {/*Delete module*/}
      {deleteToggle && isAdminView && (
        <React.Fragment>
          <hr/>
          <span className='alert lr-border'>
            Are you sure you want to delete this competition? This will affect multiple users, and deletions cannot be undone.
          </span>
          <button
            className='btn btn-primary btn-split'
            onClick={() => setDeleteToggle(false)}
          >No</button>
          <button
            className='btn btn-danger btn-split'
            onClick={handleDelete}
          >Yes</button>
        </React.Fragment>
      )}
      {/* Leave Button */}
      {!leaveToggle && !isAdmin && 
        <React.Fragment>
          <p className='lr-border'/>
          <button 
            className='btn btn-block btn-primary' 
            onClick={() => setLeaveToggle(true)}
          >
            Leave Competition
          </button>
        </React.Fragment>
      }
      {/*Leave module*/}
      {leaveToggle && !isAdmin && (
        <React.Fragment>
          <span className='alert lr-border'>
            Are you sure you want to leave this competition? Leaving a competition that has started cannot be undone.
          </span>
          <button
            className='btn btn-primary btn-split'
            onClick={() => setLeaveToggle(false)}
          >No</button>
          <button
            className='btn btn-danger btn-split'
            onClick={handleLeave}
          >Yes</button>
        </React.Fragment>
      )}
      {(!isStarted || !isActive) && !isAdminView && <hr/>}
    </React.Fragment>
  )
}

CompButtons.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  record: PropTypes.array.isRequired,
}

export default CompButtons