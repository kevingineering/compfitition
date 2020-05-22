import React from 'react'
import PropTypes from 'prop-types'
import ParticipantItem from './ParticipantItem'
import LoadingSpinner from '../../../layout/LoadingSpinner'

const Participants = ({participants, adminIds, adminRequests, isAdminView, compId, compName}) => {

 //console.log{'Participants')

  let participantList = ''
  
  if(participants.length === 0) {
    participantList = (
      <li className='collection-item center collection-item-block'>
        <LoadingSpinner />
      </li>
    )
  }
  else {
    participantList = (
      participants.map(participant => {
        let letter = adminRequests.find(request => request.userId === participant._id )
        return (
          <ParticipantItem 
            participant={participant} 
            key={participant._id} 
            isAdminView={isAdminView} 
            compId={compId}
            compName={compName}
            isUserAdmin={adminIds.includes(participant._id)}
            letter={letter}
          />
        )
      })
    )
  }

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Participants</h3>
        </li>
        {participantList}
        {participants.length !== 0 && <hr/>}
      </ul>
    </div>
  )
}

Participants.propTypes = {
  participants: PropTypes.array.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired,
  adminIds: PropTypes.array.isRequired,
  adminRequests: PropTypes.array.isRequired,
}

export default Participants