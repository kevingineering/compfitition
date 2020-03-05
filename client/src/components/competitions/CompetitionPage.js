import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import GoalContext from '../../contexts/goals/goalContext';
//import FriendContext from '../../contexts/friends/friendContext';
import CompetitionContext from '../../contexts/competitions/competitionContext';
import AlertContext from '../../contexts/alerts/alertContext';
import AuthContext from '../../contexts/auth/authContext';
import CompetitionTable from './comptable/CompetitionTable';
import CreateArray from './comptable/CreateArray';
import CompLists from './complists/CompLists';

const CompetitionPage = (props) => {
  const { goalCurrent, setCurrentGoal } = useContext(GoalContext);

  //const { friendCurrentGoal } = useContext(FriendContext);

  const { setAlert, clearAlert } = useContext(AlertContext);
  
  const [competitionArray, setCompetitionArray] = useState([]);
  
  //let goalUsed;
  
  //use useParams().participant? useParams can be loaded from react-router-dom
  //goalUsed = (props.match.params.participant === 'true') ? goalCurrent : friendCurrentGoal;
  
  const {startDate, duration, type, total} = goalCurrent;

  const { 
    getCompetitionGoals, 
    getCompetitionParticipants, 
    competition, 
    competitionGoals, 
    competitionParticipants,
    competitionError,
    clearCompetitionError,
    removeAdminFromCompetition
  } = useContext(CompetitionContext);

  const { user } = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  //calc time to determine which day of competition we are on
  let timeHours = moment().startOf('day').diff(startDate, 'hours');
  const isStarted = timeHours >= 0 ? true : false;
  let time = moment().startOf('day').diff(startDate, 'days');
  if (time > duration)
    time = duration;
  const isComplete = time === duration ? true : false;
  
  //create competitionArray
  useEffect(() => {
    if(competitionParticipants.length !== 0 && competitionGoals.length !== 0) {
      let isMax = (total !== -1)
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
      clearCompetitionError();
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
          <CompLists 
            isAdmin={isAdmin}
            isAdminView={isAdminView}
            setIsAdminView={setIsAdminView}
            competitionArray={competitionArray}
            type={type}
            participants={competitionParticipants}
            competition={competition}
            isStarted={isStarted}
            removeAdminFromCompetition={removeAdminFromCompetition}
          />
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