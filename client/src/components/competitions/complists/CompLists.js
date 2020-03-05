import React, { useState } from 'react';
import Leaderboard from './Leaderboard';
import Participants from './Participants';
import InviteTable from './InviteTable';
import PropTypes from 'prop-types';

//contains admin toggle button, Leaderboard, Participants, InviteTable, and relinquish admin button

const CompLists = ({isAdmin, isAdminView, setIsAdminView, competitionArray, type, participants, competition, isStarted, removeAdminFromCompetition}) => {
  const [relinquishToggle, setRelinquishToggle] = useState(false);

  const handleDelete = () => {
    removeAdminFromCompetition(competition._id);
    setIsAdminView(false)
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
        />
      }
      {(isAdminView && !isStarted) &&
        <InviteTable 
          participants={participants}
          compId={competition._id}
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
  type: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
  competition: PropTypes.object.isRequired,
  isStarted: PropTypes.bool.isRequired
}

export default CompLists;