import React, { useState, useContext, useEffect } from 'react'
import GoalProgress from './GoalProgress'
import GoalInfo from './GoalInfo'
import GoalButtons from './GoalButtons'
import AlertContext from '../../../contexts/alerts/alertContext'
import GoalContext from '../../../contexts/goals/goalContext'
import GoalChart from './GoalChart'
import { getTime } from '../../sharedFunctions'

const GoalPage = (props) => {

  //console.log('GoalPage')

  const { 
    setCurrentGoal, 
    goalCurrent, 
    goalsError, 
    updateGoalTracker, 
    clearGoalsError 
  } = useContext(GoalContext)

  const { setAlert, clearAlert } = useContext(AlertContext)

  const { name, duration, startDate, units, tracker, type, _id } = goalCurrent || {}
  
  const [record, setRecord] = useState(tracker)

  //set current goal and clear alert before redirect
  useEffect(() => {
    setCurrentGoal(props.match.params.goalId)
    return () => {
      clearAlert()
    }
    //eslint-disable-next-line
  }, [])

  //set record to tracker
  useEffect(() => {
    setRecord(tracker)
    //eslint-disable-next-line
  }, [goalCurrent])

  //decide if competition has started, is over, and what day we are on
  const [isStarted, time, isComplete] = getTime(startDate, duration)

  //fill missed past values in tracker array
  useEffect(() => {
    console.log(record, time - 1)
    if (record && record[time -1] === null && type === 'pass/fail') {
      setRecord(record.map((value, index) => {
        if (index < time && value === null) {
          value = false
        }
        return value
      }))
    }
    //eslint-disable-next-line
  }, [record, time])
  
  //calc goal value
  let value = 0
  if(record) {
    if (type === 'difference') {
      let temp = record.filter(value => value !== null)
      value = temp.pop() - record[0]
    } else if (type === 'total') {
      for (let i = 0; i < record.length; i++ ) {
        value += record[i]
      }
    } else if (type === 'pass/fail') {
      for (let i = 0; i < record.length; i++ ) {
        if (record[i] === true) 
        value++
      }
    }
  }

  const handleSave = async (record) => {
    await updateGoalTracker(record, _id)
    if (goalsError) {
      setAlert(goalsError)
      clearGoalsError()
    }
    else {
      setAlert('Goal saved!')
    }
  }

  return (
    <div className='form-container'>
    {(!record) ? (
      <div className="spinner"/>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        <ul>
          {isStarted && 
            <GoalChart 
              goal={goalCurrent}
              record={record}
              setRecord={setRecord} 
              time={time}
              isComplete={isComplete}
              isOwner={true}
              isStarted={isStarted}
            />
          }
          {isStarted && !isComplete && type !== 'pass/fail' &&
            <GoalProgress 
              type={type}
              time={time}
              record={record}
              setRecord={setRecord}
              units={units}
            />
          }
          <GoalInfo 
            goal={goalCurrent}
            record={record}
            time={time}
            value={value}
            isStarted={isStarted}
          />
        </ul>
        <GoalButtons 
          isStarted={isStarted}
          isActive={time < duration} 
          isOwner={true}
          handleSave={handleSave}
          record={record}
        />
      </React.Fragment>
    )}
    </div>
  )
}

export default GoalPage