import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CompetitionContext from '../../../contexts/competitions/competitionContext';
import ParticipantButtons from './ParticipantButtons';

const ParticipantItem = ({participant: {_id, firstName, alias}, isAdminView, compId, isUserAdmin, isUserInvited}) => {
  const [userToggle, setUserToggle] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);

  const { kickUserFromCompetition } = useContext(CompetitionContext);


  let name = (isAdminView && !isUserAdmin) ? (
    <React.Fragment>
      <span className='block'>
        {alias ? alias : firstName} {isUserAdmin && '(admin)'} {isUserInvited && '(admin pending)'}
      </span>
      <button 
        className='btn-participants btn-primary' 
        onClick={() => {
          setUserToggle(!userToggle)
          setDeleteToggle(false)
        }}
      >
        <i className={userToggle ? 'fas fa-times' : 'fas fa-plus'}/>
      </button>
    </React.Fragment>
  ) : (
    <span className='block'>
      {alias ? alias : firstName} {isUserAdmin && '(admin)'}
    </span>
  )

  return (
    <React.Fragment>
      {userToggle && <hr/>}
      <div className='participant-row space-between lr-border'>
        {name}
      </div>
      {userToggle && 
        <ParticipantButtons 
          isUserInvited={isUserInvited}
          compId={compId}
          userId={_id}          
        />
      }
      {deleteToggle &&
        <div className="lr-border">
          <span className='participant-row block'>Are you sure you want to kick this user from this competition?</span>
          <input
            type='button'
            value='No'
            className='btn btn-primary btn-split margin-0'
            onClick={() => setDeleteToggle(false)}
          />
          <input
            type='button'
            value='Yes'
            className='btn btn-danger btn-split margin-0'
            onClick={() => kickUserFromCompetition(compId, _id)}
          />
        </div>
      }
    </React.Fragment>
  )
}

ParticipantItem.propTypes = {
  participant: PropTypes.object.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  isUserInvited: PropTypes.bool.isRequired
}

export default ParticipantItem;