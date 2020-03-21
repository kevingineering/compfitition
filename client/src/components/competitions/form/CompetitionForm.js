import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import GoalContext from '../../../contexts/goals/goalContext'
import CompetitionContext from '../../../contexts/competitions/competitionContext'
import AlertContext from '../../../contexts/alerts/alertContext'
import GoalInputs from '../../goals/form/GoalInputs'
import { verifyDates, handleGoalChange } from '../../sharedFunctions'

const CompetitionForm = () => {

 //console.log{'CompetitionForm')

  const goalContext = useContext(GoalContext)
  const { addGoal, goalCurrent, setCurrentGoal, getGoals } = goalContext

  const alertContext = useContext(AlertContext)
  const { setAlert, clearAlert } = alertContext

  const competitionContext = useContext(CompetitionContext)
  const { addCompetition, updateCompetition, competition } = competitionContext

  //started determines if goal has begun
  //initialValue is used with difference goals 
  const [goal, setGoal] = useState({
    name: '',
    duration: 28,
    startDate: moment().startOf('day').format('YYYY-MM-DD'),
    type: 'pass/fail',
    description: '',
    units: '',
    total: 7,
    isPrivate: false,
    compId: null,
    initialValue: 0,
    started: false
  })
  
  //runs necessary functions before redirect
  const [isSubmit, setIsSubmit] = useState(false)

  //helps update competition with useEffect
  const [isUpdate, setIsUpdate] = useState(false)

  //on start, control if adding or updating competition
  useEffect(() => {
    if (Object.entries(goalCurrent).length) {
      setIsUpdate(true)
      setGoal({ 
        ...goalCurrent, 
        startDate: moment.utc(goalCurrent.startDate).startOf('day'),
        initialValue: goalCurrent.tracker[0]
      })
      if (moment(goalCurrent.startDate).startOf('day') < moment().startOf('day')) {
        setGoal({
          ...goalCurrent, 
          started: true
        })
        setAlert('This competition has already begun, so some attributes cannot be changed.')
      }
    }
    //eslint-disable-next-line
  }, [])

  //if adding, create competition, clear alert, and redirect
  //if updating, get goals, set updated goal as current, clear alert, and redirect
  let history = useHistory()
  useEffect(() => {
    if (isSubmit && !isUpdate) {
      let temp = async () => {
        await addCompetition(goalCurrent._id)
        clearAlert()
        history.push('/competition')
      }
      temp()
    }
    else if (isSubmit && isUpdate) {
      let temp = async () => {
        await getGoals()
        setCurrentGoal(goalCurrent._id)
        clearAlert()
        history.push('/competition')
      }
      temp()
    }
    //eslint-disable-next-line
  }, [isSubmit, isUpdate])
  
  //destructure goal 
  const { name, duration, startDate, type, units, total, isPrivate, started } = goal
  
  //add or update competition
  const handleSubmit = async e => {
    e.preventDefault()
    
    const msg = verifyDates(startDate, started, duration)

    //try to submit 
    if(!msg && name && duration && startDate && type && total && (units || type === 'pass/fail')) {
      //add/update competition and tell user
      if (message === 'Modify Competition') {
        await updateCompetition({goal, _id: competition._id})
        setAlert('Competition updated!', true)
      } else {
        await addGoal(goal)
        setAlert('Competition added!', true)
      }
      setIsSubmit(true)
    }
    else 
      setAlert(msg || 'Please enter all fields.')
  }

  //update state with inputs
  const handleChange = e => {
    handleGoalChange(e, setGoal, goal)
  }

  //update isPrivate state with input
  const handleClick = e => {
    setGoal({ ...goal, isPrivate: !isPrivate })
  }

  const handleIsMax = () => {
    if (total === -1)
      setGoal({ ...goal, total: 7})
    else
      setGoal({ ...goal, total: -1})
  }
  
  const message = Object.entries(goalCurrent).length ? 'Modify Competition' : 'Add Competition'

  return (
    <GoalInputs
      goal={goal}
      message={message}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleClick={handleClick}
      handleIsMax={handleIsMax}
      isGoal={false}
    />   
  )
}

export default CompetitionForm