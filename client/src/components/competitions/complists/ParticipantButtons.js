import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import LetterContext from '../../../contexts/letters/letterContext';
import CompetitionContext from '../../../contexts/competitions/competitionContext';

const ParticipantButtons = ({isUserInvited, compId, userId}) => {

  const { kickUserFromCompetition } = useContext(CompetitionContext);

  const { letters } = useContext(LetterContext);

  const handleDeleteRequest = () => {
    console.log(letters)
  }

  const handleSendRequest = () => {

  }

  const handleKickUser = () => {
    kickUserFromCompetition(compId, userId)
  }

  let buttons = isUserInvited ? (
    <React.Fragment>
      <button 
        className='btn btn-split btn-primary height-55' 
        onClick={handleDeleteRequest}
      >
        Delete Admin Request
      </button>
      <button 
        className='btn btn-split btn-danger height-55' 
        onClick={handleKickUser}
      >
        Kick User
      </button>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <button 
        className='btn btn-split btn-primary' 
        onClick={handleSendRequest}
      >
        Make Admin
      </button>
      <button 
        className='btn btn-split btn-danger' 
        onClick={handleKickUser}
      >
        Kick User
      </button>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      {buttons}
    </React.Fragment>
  )
}

ParticipantButtons.propTypes = {
  isUserInvited: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}

export default ParticipantButtons;