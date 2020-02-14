import React, { useContext, useState, useEffect } from 'react';
import GoalContext from '../../contexts/goals/goalContext';
import CompetitionContext from '../../contexts/competitions/competitionContext';
import AlertContext from '../../contexts/alerts/alertContext';
import AuthContext from '../../contexts/auth/authContext';
import Leaderboard from './complists/Leaderboard';
import Participants from './complists/Participants';
import InviteTable from './complists/InviteTable';
import moment from 'moment';
import CompetitionTable from './comptable/CompetitionTable';
import CreateArray from './comptable/CreateArray';

const CompetitionPage = () => {
  const { goalCurrent, setCurrentGoal } = useContext(GoalContext);

  const {startDate, duration, type} = goalCurrent;
  
  const { setAlert, clearAlert } = useContext(AlertContext);

  const [competitionArray, setCompetitionArray] = useState([]);

  const { 
    getCompetitionGoals, 
    getCompetitionParticipants, 
    competition, 
    competitionGoals, 
    competitionParticipants,
    competitionError
  } = useContext(CompetitionContext);

  const { user } = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  //calc time to determine which day of competition we are on
  let time = moment().startOf('day').diff(startDate, 'days');
  let timeHours = moment().startOf('day').diff(startDate, 'hours');
  const isStarted = timeHours >= 0 ? true : false;
  if (time > duration)
    time = duration;
  const isComplete = time === duration ? true : false;
  
  //create competitionArray
  useEffect(() => {
    if(competitionParticipants.length !== 0 && competitionGoals.length !== 0) {
      let isMax = (goalCurrent.total !== -1)
      let array = CreateArray(
        competitionParticipants, 
        competitionGoals, 
        type, 
        time, 
        duration, 
        isMax
      );
      setCompetitionArray(array);
    }
    //eslint-disable-next-line
  }, [competitionGoals, competitionParticipants])
  
  //set alert if error occurs
  useEffect(() => {
    if(competitionError)
      setAlert(competitionError);
    //eslint-disable-next-line
  }, [competitionError])

  //clear alert and competition before redirect
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, []);

  //get competition goals and participants
  useEffect(() => {
    if(Object.entries(competition).length !== 0) {
      getCompetitionGoals(competition._id);
      getCompetitionParticipants(competition._id);
      setCurrentGoal(goalCurrent._id);
      if(competition.adminIds.includes(user._id))
        setIsAdmin(true);
    }
    //eslint-disable-next-line
  }, [competition])

  return (
    <div className='competition-container'>
      <div className='grid-1-2'>
        <div>
          {isAdmin && 
            <div className='collection competition-lists-container'>
              <button className='btn btn-primary btn-block' onClick={() => setIsAdminView(!isAdminView)}>
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
              participants={competitionParticipants} 
              isAdminView={isAdminView}
              compId={competition._id}
            />
          }
          {(isAdminView && !isStarted) &&
            <InviteTable 
              participants={competitionParticipants}
            />
          }
        </div>
        <div>
          <CompetitionTable 
            isAdminView={isAdminView}
            isStarted={isStarted}
            isActive={time < duration}
            isComplete={isComplete} 
            time={time}
            competitionArray={competitionArray}
          />
        </div>
      </div>
    </div>
  )
}

export default CompetitionPage;