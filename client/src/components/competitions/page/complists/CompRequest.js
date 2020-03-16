import React, {useContext} from 'react'
import CompetitionContext from '../../../../contexts/competitions/competitionContext'
import LetterContext from '../../../../contexts/letters/letterContext'
import PropTypes from 'prop-types'

const CompRequest = ({letters, user, isParticipant, compId, compName, startDate}) => {
  const { addUserToCompetition, addAdminToCompetition } = useContext(CompetitionContext)
  const { addLetter, deleteLetter } = useContext(LetterContext)

  //user not in competition but wants to join
  const handleRequest = async () => {
    const fields = {
      type: 'fromUser',
      compId: compId,
      compName: compName,
      userId: user._id,
      startDate: startDate,
      userName: `${user.firstName} ${user.lastName}`
    }
    await addLetter(fields)
  }
  
  //user not in competition and wants to cancel request 
  const handleCancel = async () => {
    await deleteLetter(userLetter._id)
  }

  //user invited to join competition
  const handleAcceptInvite = async () => {
    await addUserToCompetition(userLetter._id)
  }

  //user asked to be admin
  const handleAcceptAdmin = async () => {
    await addAdminToCompetition(userLetter._id)
  }

  //get user letters
  let userLetter = null
  if(letters)
    userLetter = letters.find(letter => letter.userId === user._id)
  
  let jsxElements = ''

  //determine type of letter and show
  if (!isParticipant && !userLetter) {
    jsxElements = (
      <button className='btn btn-block btn-primary' onClick={handleRequest}>
        <h3>Request to join competition</h3>
      </button>
    )
  } else if (!isParticipant && userLetter && userLetter.type === 'fromUser') {
    jsxElements = (
      <button className='btn btn-block btn-primary' onClick={handleCancel}>
        <h3>Cancel request to join competition</h3>
      </button>
    )
  } else if (!isParticipant && userLetter && userLetter.type === 'toUser') {
    jsxElements = (
      <React.Fragment>
        <button className='btn btn-block btn-primary margin-bottom-1rem' onClick={handleAcceptInvite}>
          <h3>Accept Invite</h3>
        </button>
        <button className='btn btn-block btn-primary margin-bottom-1rem' onClick={handleCancel}>
          <h3>Reject Invite</h3>
        </button>
      </React.Fragment>
    )
  } else if (isParticipant && userLetter && userLetter.type === 'requestAdmin') {
    jsxElements = (
      <React.Fragment>
        <button className='btn btn-block btn-primary margin-bottom-1rem' onClick={handleAcceptAdmin}>
          <h3>Accept Admin Role</h3>
        </button>
        <button className='btn btn-block btn-primary margin-bottom-1rem' onClick={handleCancel}>
          <h3>Reject Admin Role</h3>
        </button>
      </React.Fragment>
    )
  } else {
    return null
  }

  return (
    <div className='collection competition-lists-container'>
      {jsxElements}
    </div>
  )
}

CompRequest.propTypes = {
  letters: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  isParticipant: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
}

export default CompRequest