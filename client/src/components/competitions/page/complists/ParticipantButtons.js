import React, { useState, useContext} from 'react'
import PropTypes from 'prop-types'
import LetterContext from '../../../../contexts/letters/letterContext'
import CompetitionContext from '../../../../contexts/competitions/competitionContext'

const ParticipantButtons = ({letter, compId, compName, userId, setUserToggle}) => {

 //console.log{'ParticipantButtons')

  const [deleteToggle, setDeleteToggle] = useState(false)

  const { kickUserFromCompetition } = useContext(CompetitionContext)

  const { addLetter, deleteLetter } = useContext(LetterContext)

  const handleDeleteRequest = () => {
    setUserToggle(false)
    deleteLetter(letter._id)
  }

  const handleSendRequest = () => {
    setUserToggle(false)
    const fields = {
      type: 'requestAdmin',
      compId: compId,
      compName: compName,
      userId: userId,
    }
    addLetter(fields)
  }

  let buttons = letter ? (
    <React.Fragment>
      <button 
        className='btn btn-split btn-primary height-65' 
        onClick={handleDeleteRequest}
      >
        Delete Admin Request
      </button>
      <button 
        className='btn btn-split btn-danger height-65' 
        onClick={() => setDeleteToggle(true)}
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
        onClick={() => setDeleteToggle(true)}
      >
        Kick User
      </button>
    </React.Fragment>
  )

  if(deleteToggle) {
    buttons = (
      <div className="lr-border">
        <span className='participant-row block'>Are you sure you want to kick this user? This action cannot be undone.</span>
        <button
          className='btn btn-primary btn-split margin-0'
          onClick={() => setDeleteToggle(false)}
        >No</button>
        <button
          className='btn btn-danger btn-split margin-0'
          onClick={() => kickUserFromCompetition(compId, userId)}
        >Yes</button>
      </div>
    )
  }

  return (
    <React.Fragment>
      {buttons}
    </React.Fragment>
  )
}

ParticipantButtons.propTypes = {
  letter: PropTypes.object,
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  setUserToggle: PropTypes.func.isRequired,
}

export default ParticipantButtons