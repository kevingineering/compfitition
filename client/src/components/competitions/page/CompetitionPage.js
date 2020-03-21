import React, { useContext, useState, useEffect } from 'react'
import GoalContext from '../../../contexts/goals/goalContext'
import CompetitionContext from '../../../contexts/competitions/competitionContext'
import AlertContext from '../../../contexts/alerts/alertContext'
import AuthContext from '../../../contexts/auth/authContext'
import LetterContext from '../../../contexts/letters/letterContext'
import CompetitionTable from './comptable/CompetitionTable'
import CreateArray from './comptable/CreateArray'
import CompLists from './complists/CompLists'
import CompRequest from './complists/CompRequest'
import { getTime } from '../../sharedFunctions'

const CompetitionPage = (props) => {

 //console.log{'CompetitionPage')

  const { goalCurrent, setCurrentGoalByComp } = useContext(GoalContext)
  const { setAlert, clearAlert } = useContext(AlertContext)
  const { getLetters, letters, clearLetters } = useContext(LetterContext)
  const { user } = useContext(AuthContext)
  const { 
    getCompetition,
    getCompetitionGoals, 
    getCompetitionCurrentGoal,
    getCompetitionParticipants, 
    getCompetitionInvitees,
    competition, 
    competitionGoals, 
    competitionParticipants,
    competitionInvitees,
    competitionCurrentGoal,
    competitionError,
    clearCompetitionError,
    removeAdminFromCompetition
  } = useContext(CompetitionContext)

  const [competitionArray, setCompetitionArray] = useState([])
  const [isParticipant, setIsParticipant] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminView, setIsAdminView] = useState(false)
  
  //get competition and clear alert, letters, and competition before redirect
  useEffect(() => {
    let temp = async () => await getCompetition(props.match.params.compId)
    temp()
    return async () => {
      await clearAlert()
      await clearLetters()
    }
    //eslint-disable-next-line
  }, [])

  //set alert if error occurs
  useEffect(() => {
    if(competitionError)
      setAlert(competitionError)
      clearCompetitionError()
    //eslint-disable-next-line
  }, [competitionError])

  //get letters, goals, participants, invitees, and decide if user is participant
  useEffect(() => {
    if(Object.entries(competition).length !== 0) {
      getLetters(competition._id)
      getCompetitionGoals(competition._id)
      getCompetitionParticipants(competition._id)
      getCompetitionInvitees(competition._id)
      if(competition.userIds.includes(user._id)) {
        //set current goal if routed here through notifications
        if(Object.entries(goalCurrent).length === 0) 
          setCurrentGoalByComp(competition._id)
        setIsParticipant(true)
        if(competition.adminIds.includes(user._id)) {
          setIsAdmin(true)
          setIsAdminView(true)
        } else {
          setIsAdminView(false)
        }
      } else {
        //get template goal
        getCompetitionCurrentGoal(competition._id)
      }
    }
    //eslint-disable-next-line
  }, [competition])

  //   !isGoal && !isOwner && await getCompetitionCurrentGoal(compId, friendCurrent._id)

  //set goal used - own goal if participant, competition goal if not
  const goalUsed = (goalCurrent && isParticipant) ? goalCurrent : competitionCurrentGoal

  //determine if competition has started, completed, and what day we are on
  const [isStarted, time, isComplete] = goalUsed ? getTime(goalUsed.startDate, goalUsed.duration) : [false, 0, false]

  //create competitionArray
  useEffect(() => {
    //ensure goalUsed, participants and goals are loaded and non zero
    //matching lengths ensures both are up to date after new members added
    if(goalUsed &&
      competitionParticipants.length !== 0 && 
      competitionParticipants.length === competitionGoals.length) {
      let isMax = (goalUsed.total !== -1)
      let array = CreateArray(
        competitionParticipants, 
        competitionGoals, 
        goalUsed.type, 
        time, 
        goalUsed.duration, 
        isMax
      )
      setCompetitionArray(array)
    }
    //eslint-disable-next-line
  }, [competitionGoals, competitionParticipants, goalUsed])
  
  return (
    //verify participants and goals are both loaded and up to date
    (
      competitionParticipants.length === 0 ||
      competitionParticipants.length !== competitionGoals.length ||
      !goalUsed || 
      Object.entries(goalUsed).length === 0
    ) ? <div className="spinner"/> :
    <div className='competition-container'>
      <div className='grid-2-1'>
        <div>
          <CompetitionTable 
            isAdmin={isAdmin}
            isAdminView={isAdminView}
            isStarted={isStarted}
            isActive={time < goalUsed.duration}
            isComplete={isComplete} 
            isParticipant={isParticipant}
            time={time}
            competitionArray={competitionArray}
            goal={goalUsed}
          />
        </div>
        <div>
          <CompRequest
            letters={letters}
            user={user}
            isParticipant={isParticipant}
            compId={competition._id}
            compName={goalUsed.name}
            startDate={goalUsed.startDate}
            isStarted={isStarted}
          />
          <CompLists 
            isAdmin={isAdmin}
            isAdminView={isAdminView}
            setIsAdminView={setIsAdminView}
            competitionArray={competitionArray}
            participants={competitionParticipants}
            invitees={competitionInvitees}
            competition={competition}
            isStarted={isStarted}
            removeAdminFromCompetition={removeAdminFromCompetition}
            goal={goalUsed}
            letters={letters}
          />
        </div>

      </div>
    </div>
  )
}

export default CompetitionPage