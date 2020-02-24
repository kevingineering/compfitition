import React from 'react';
import PropTypes from 'prop-types';
import ParticipantItem from './ParticipantItem';

const Participants = ({participants, isAdminView, compId}) => {

  let participantList = '';
  
  if(participants.length === 0) {

    participantList = (
      <li className='collection-item center collection-item-block'>
        Loading...
      </li>
    )
  }
  else {
    participantList = (
      participants.map(participant => {
        return (
          <ParticipantItem 
            participant={participant} 
            key={participant._id} 
            isAdminView={isAdminView} 
            compId={compId}
          />
        )
      })
    );
  }

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Participants</h3>
        </li>
        {participantList}
        <hr/>
      </ul>
    </div>
  )
}

Participants.propTypes = {
  participants: PropTypes.array.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired
}

export default Participants;