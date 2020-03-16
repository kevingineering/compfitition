import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ParticipantButtons from './ParticipantButtons'

const ParticipantItem = ({participant: {_id, firstName, alias}, isAdminView, compId, compName, isUserAdmin, letter}) => {

 //console.log{'ParticipantItem')

  const [userToggle, setUserToggle] = useState(false);

  let name = (isAdminView && !isUserAdmin) ? (
    <React.Fragment>
      <span className='block'>
        {alias ? alias : firstName} {isUserAdmin && '(admin)'} {letter && '(admin pending)'}
      </span>
      <button 
        className='btn-participants btn-primary' 
        onClick={() => {
          setUserToggle(prevState => !prevState)
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
      <div className='participant-row space-between lr-border'>
        {name}
      </div>
      {userToggle && 
        <ParticipantButtons 
          letter={letter}
          compId={compId}
          compName={compName}
          userId={_id}          
          setUserToggle={setUserToggle}
        />
      }
    </React.Fragment>
  )
}

ParticipantItem.propTypes = {
  participant: PropTypes.object.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  letter: PropTypes.object,
}

export default ParticipantItem;