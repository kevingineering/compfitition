import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import LetterContext from '../../../contexts/letters/letterContext';

const InviteItem = ({friend: {_id, firstName, lastName}, isPending, compId}) => {

  const [inviteToggle, setInviteToggle] = useState(false)

  const { addLetter, deleteLetter } = useContext(LetterContext);

  //compId, message (adminname, compname), userId, startDate

  return (
    <React.Fragment>
      {inviteToggle && <hr/>}
      <div className='participant-row space-between lr-border'>
        <span className='block'>{firstName} {lastName}</span>
        <button 
          className='btn-participants btn-primary'
          onClick={() => setInviteToggle(!inviteToggle)}
        >
          <i className={inviteToggle ? 'fas fa-minus' : 'fas fa-plus'}/>
        </button>
      </div>
      {inviteToggle &&
        <div className="lr-border">
          <span className='participant-row block'>
            {isPending ? 'Delete this user\'s invite?' : 'Invite this user to join competition?'}
          </span>
          <input
            type='button'
            value='No'
            className='btn btn-primary btn-split margin-0'
            onClick={() => setInviteToggle(false)}
          />
          <input
            type='button'
            value='Yes'
            className='btn btn-primary btn-split margin-0'
            onClick={() => {isPending ? deleteLetter(compId, _id) : addLetter(compId, _id)}}
          />
        </div>
      }
    </React.Fragment>
  )
}

InviteItem.propType = {
  friend: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  compId: PropTypes.string.isRequired
}

export default InviteItem;