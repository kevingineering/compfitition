import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import CompetitionContext from '../../../../contexts/competitions/competitionContext'
import LetterContext from '../../../../contexts/letters/letterContext'

const RequestItem = ({request}) => {

 //console.log('RequestItem')

  const { addUserToCompetition } = useContext(CompetitionContext)
  const { deleteLetter } = useContext(LetterContext);


  const handleAccept = () => {
    addUserToCompetition(request._id)
  }

  const handleReject = () => {
    deleteLetter(request._id)
  }

  return (
    <div className='search-link lr-border'>
      <div className='table-info'>
        <span>{request.message}</span>
      </div>
      <div className='right'>
        <button
          className='search-btn btn-primary block'
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className='search-btn btn-primary block'
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  )
}

RequestItem.propTypes = {
  request: PropTypes.object.isRequired,
}

export default RequestItem
