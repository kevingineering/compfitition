import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import FriendContext from '../../../contexts/friends/friendContext'
import GoalContext from '../../../contexts/goals/goalContext'
import CompetitionContext from '../../../contexts/competitions/competitionContext'
import FriendGoals from './FriendGoals'
import FriendFriends from './FriendFriends'
import DeleteFriend from './DeleteFriend'

const FriendPage = () => {

 //console.log{'FriendPage')

  const { clearCurrentGoal } = useContext(GoalContext)
  const { friendIds, friendCurrent } = useContext(FriendContext)
  const { clearCompetition } = useContext(CompetitionContext)

  let history = useHistory()
  
  useEffect(() => {
    //redirect if no friend current
    clearCurrentGoal()
    clearCompetition()
    if(Object.entries(friendCurrent).length === 0) {
      history.goBack()
    }
    //redirect if users are not friends
    if(!friendIds.includes(friendCurrent._id)) {
      history.goBack()
    }
    //eslint-disable-next-line
  }, [])

  return (
    Object.entries(friendCurrent).length !== 0 && 
    <React.Fragment>
      <div className='grid-2'>
        <FriendGoals/>
        <FriendFriends/>
      </div>
      <DeleteFriend userId={friendCurrent._id}/>
    </React.Fragment>
  )
}

export default FriendPage