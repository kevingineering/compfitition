import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import GoalContext from '../../../contexts/goals/goalContext'
import GoalTable from './GoalTable'

const Goals = () => {

 //console.log{'Goals')

  const goalContext = useContext(GoalContext)
  const { getGoals, goals, goalsLoading } = goalContext

  useEffect(() => {
    getGoals()
    //eslint-disable-next-line
  }, [])

  const [activeGoals, setActiveGoals] = useState([])
  const [pastGoals, setPastGoals] = useState([])
  const [activeCompetitions, setActiveCompetitions] = useState([])
  const [pastCompetitions, setPastCompetitions] = useState([])

  //create arrays for past and active goals and competitions
  useEffect(() => {
    if (goals.length !== 0) {
      let active = goals.filter(goal => 
        (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration)
      
      setActiveGoals(active.filter(goal => goal.compId === null))
      setActiveCompetitions(active.filter(goal => goal.compId !== null))
  
      let past = goals.filter(goal => 
        (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration)
  
      setPastGoals(past.filter(goal => goal.compId === null))
      setPastCompetitions(past.filter(goal => goal.compId !== null))
    }
  }, [goals])

  return (
    <div>
      <GoalTable
        goals={activeGoals} 
        isPast={false} 
        isGoal={true}
        isOwner={true}
        loading={goalsLoading}
      />
      <GoalTable
        goals={activeCompetitions}
        isPast={false} 
        isGoal={false}
        isOwner={true}
        loading={goalsLoading}
      />
      <GoalTable
        goals={pastGoals}
        isPast={true} 
        isGoal={true}
        isOwner={true}
        loading={goalsLoading}
      />
      <GoalTable
        goals={pastCompetitions}
        isPast={true} 
        isGoal={false}
        isOwner={true}
        loading={goalsLoading}
      />
    </div>
  )
}

export default Goals