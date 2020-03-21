import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import LetterContext from '../../../../contexts/letters/letterContext'
import AuthContext from '../../../../contexts/auth/authContext'

const InviteItem = ({friend: {_id, firstName, lastName}, inviteId, compId, compName, startDate}) => {

 //console.log{'InviteItem')

  const [inviteToggle, setInviteToggle] = useState(false)

  const { addLetter, deleteLetter } = useContext(LetterContext)
  const { user } = useContext(AuthContext)

  const handleAdd = () => {
    const fields = {
      type: 'toUser',
      compId: compId,
      compName: compName,
      userId: _id,
      startDate: startDate,
      userName: `${user.firstName} ${user.lastName}`
    }

    addLetter(fields)
    setInviteToggle(false)
  }

  const handleDelete = () => {
    deleteLetter(inviteId)
    setInviteToggle(false)
  }

  return (
    <React.Fragment>
      <div className='invite-row space-between lr-border'>
        <span className='block'>{firstName} {lastName} {inviteId && '(pending)'}</span>
        <button 
          className='btn-participants btn-primary'
          onClick={() => setInviteToggle(!inviteToggle)}
        >
          <i className={inviteToggle ? 'fas fa-minus' : 'fas fa-plus'}/>
        </button>
      </div>
      {inviteToggle &&
        <div className="lr-border">
          <span className='invite-row block'>
            {inviteId ? 'Delete this user\'s invite?' : 'Invite this user to join competition?'}
          </span>
          <button
            className='btn btn-primary btn-split margin-0'
            onClick={() => setInviteToggle(false)}
          >No</button>
          <button
            className='btn btn-primary btn-split margin-0'
            onClick={() => {inviteId ? handleDelete() : handleAdd()}}
          >Yes</button>
        </div>
      }
    </React.Fragment>
  )
}

InviteItem.propType = {
  friend: PropTypes.object.isRequired,
  inviteId: PropTypes.string.isRequired,
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired
}

export default InviteItem