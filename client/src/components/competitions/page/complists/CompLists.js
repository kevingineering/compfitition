import React, { useState } from 'react';
import Leaderboard from './Leaderboard';
import Participants from './Participants';
import Invites from './Invites';
import PropTypes from 'prop-types';
import Requests from './Requests';

//contains admin toggle button, Leaderboard, Participants, Invites, Requests, and relinquish admin button

const CompLists = ({isAdmin, isAdminView, setIsAdminView, competitionArray, goal, participants, competition, isStarted, removeAdminFromCompetition, letters}) => {

 //console.log{'CompLists')

  const [relinquishToggle, setRelinquishToggle] = useState(false);

  const { type, name, startDate} = goal;

  const handleDelete = () => {
    removeAdminFromCompetition(competition._id);
    setIsAdminView(false)
  }

  let userRequests = []
  let adminRequests = []
  let userInvites = []

  if(letters.length !== 0) {
    userRequests = letters.filter(letter => letter.type === 'fromUser')
    adminRequests = letters.filter(letter => letter.type === 'requestAdmin')
    userInvites = letters.filter(letter => letter.type === 'toUser')
  }

  return (
    <div>
      {isAdmin && 
        <div className='collection competition-lists-container'>
          <button className='btn btn-block btn-primary' onClick={() => setIsAdminView(prevState => !prevState)}>
            <h3>{isAdminView ? 'View as User' : 'View as Admin'}</h3>
          </button>
        </div>
      }
      {userRequests.length !== 0 &&
        <Requests 
          requests={userRequests}
        />
      }
      {isStarted &&
        <Leaderboard 
          competitionArray={competitionArray}
          type={type}
        />
      }
      {(isAdminView || !isStarted) && 
        <Participants 
          participants={participants} 
          isAdminView={isAdminView}
          compId={competition._id}
          adminIds={competition.adminIds}
          adminRequests={adminRequests}
        />
      }
      {(isAdminView && !isStarted) &&
        <Invites 
          participants={participants}
          compId={competition._id}
          compName={name}
          startDate={startDate}
          invites={userInvites}
        />
      }
      {isAdmin && isAdminView &&
        <div className='collection competition-lists-container'>
          <button 
            className='btn btn-block btn-primary' 
            onClick={() => setRelinquishToggle(true)}
          >
            <h3>Relinquish Admin Role?</h3>
          </button>
          {relinquishToggle &&
            <React.Fragment>
              <span className='alert lr-border'>
                Are you sure you want to relinquish your admin responsibilities? Note that a competition must have at least one admin.
              </span>
              <button
                className='btn btn-primary btn-split'
                onClick={() => setRelinquishToggle(false)}
              >No</button>
              <button
                className='btn btn-danger btn-split'
                onClick={handleDelete}
              >Yes</button>
            </React.Fragment>
          }
        </div>
      }
    </div>
  )
}

CompLists.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isAdminView: PropTypes.bool.isRequired,
  setIsAdminView: PropTypes.func.isRequired,
  competitionArray: PropTypes.array.isRequired,
  goal: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  competition: PropTypes.object.isRequired,
  isStarted: PropTypes.bool.isRequired,
  letters: PropTypes.array.isRequired,
}

export default CompLists;