import React, { useState, useContext, useEffect } from 'react'
import GoalInfo from '../../goals/page/GoalInfo'
import FriendContext from '../../../contexts/friends/friendContext'
import GoalChart from '../../goals/page/GoalChart'
import { getTime } from '../../sharedFunctions'
import LoadingSpinner from '../../layout/LoadingSpinner'

const FriendGoalPage = (props) => {

 //console.log{'FriendGoalPage')

  const { friendCurrentGoal, setCurrentFriendGoal } = useContext(FriendContext)

  const { name, duration, startDate, tracker, type } = friendCurrentGoal || {}
 
  const [record, setRecord] = useState(tracker)

  //set friend goal 
  useEffect(() => {
    setCurrentFriendGoal(props.match.params.goalId)
    //eslint-disable-next-line
  }, [])

  //set record to tracker
  useEffect(() => {
    setRecord(tracker)
    //eslint-disable-next-line
  }, [friendCurrentGoal])
  
  //fill missed past values in tracker array - will not be saved
  useEffect(() => {
    if (type === 'pass/fail') {
      setRecord(record.map((value, index) => {
        if (index < time && value === null) {
          value = false
        }
        return value
      }))
    }
    //eslint-disable-next-line
  }, [])

  //decide if competition has started, is over, and what day we are on
  const [isStarted, time, isComplete] = getTime(startDate, duration)

  useEffect(() => {
    if (record && record[time - 1] === null && type === 'pass/fail') {
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
  
  return (
    <div className='form-container'>
    {!record ? (
      <LoadingSpinner />
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        <ul>
          {isStarted && 
            <GoalChart 
              goal={friendCurrentGoal}
              record={record}
              setRecord={setRecord} 
              time={time}
              isComplete={isComplete}
              isOwner={false}
              isStarted={isStarted}
            />
          }
          <GoalInfo 
            goal={friendCurrentGoal}
            record={record}
            time={time}
            value={value}
            isStarted={isStarted}
          />
        </ul>
        <hr/>
      </React.Fragment>
    )}
    </div>
  )
}

export default FriendGoalPage