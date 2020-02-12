import React, { useState, useContext } from 'react';
import CompetitionContext from '../../../contexts/competitions/competitionContext';

const ParticipantItem = ({participant: {_id, firstName, lastName}, isAdminView, compId}) => {
  const [userToggle, setUserToggle] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);

  const { kickUserFromCompetition } = useContext(CompetitionContext);

  // const handleClick = () => {
  //   setUse
  // }

  return (
    <React.Fragment>
      {userToggle && <hr/>}
      <div className='participant-row space-between lr-border'>
        <span className='block'>
          {firstName} {lastName} {false && '(admin)'} {true && '(admin pending)'}
        </span>
        {isAdminView && 
          <button 
            className='btn-participants btn-primary' 
            onClick={() => {
              setUserToggle(!userToggle)
              setDeleteToggle(false)
            }}
          >
            <i className={userToggle ? 'fas fa-times' : 'fas fa-plus'}/>
          </button>
        }
      </div>
      {userToggle && 
        <React.Fragment>
          <button 
            className='btn btn-split btn-primary' 
            onClick={console.log('send admin invite')}
          >
            Make Admin
          </button>
          <button 
            className='btn btn-split btn-danger' 
            onClick={() => setDeleteToggle(!deleteToggle)}
          >
            Kick User
          </button>
        </React.Fragment>
      }
      {deleteToggle &&
        <div className="lr-border">
          <span className='participant-row block'>Are you sure you want to kick this user from this competition?</span>
          <input
            type='button'
            value='No'
            className='btn btn-primary btn-split'
            onClick={() => setDeleteToggle(false)}
            style={{margin: 0}}
          />
          <input
            type='button'
            value='Yes'
            className='btn btn-danger btn-split'
            onClick={() => kickUserFromCompetition(compId, _id)}
            style={{margin: 0}}
          />
        </div>
      }
    </React.Fragment>
  )
}

export default ParticipantItem;