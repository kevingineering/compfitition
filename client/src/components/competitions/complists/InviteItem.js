import React, { useState, useContext } from 'react';
import InviteContext from '../../../contexts/invites/inviteContext';

const InviteItem = ({friend: {firstName, lastName}, isPending}) => {

  const [inviteToggle, setInviteToggle] = useState(false)

  const { addInvite, deleteInvite } = useContext(InviteContext);

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
            className='btn btn-primary btn-split'
            onClick={() => setInviteToggle(false)}
            style={{margin: 0}}
          />
          <input
            type='button'
            value='Yes'
            className='btn btn-primary btn-split'
            onClick={() => {isPending ? deleteInvite() : addInvite()}}
            style={{margin: 0}}
          />
        </div>
      }
    </React.Fragment>
  )
}

export default InviteItem;