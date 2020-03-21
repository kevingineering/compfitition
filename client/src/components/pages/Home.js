import React, { useContext, useEffect }  from 'react'
import Goals from '../goals/list/Goals'
import Friends from '../friends/user/Friends'
import Notifications from '../letters/Notifications'
import GoalContext from '../../contexts/goals/goalContext'
import FriendContext from '../../contexts/friends/friendContext'
import CompetitionContext from '../../contexts/competitions/competitionContext'

const Home = () => {

 //console.log{'Home')
  
  const { clearCurrentGoal } = useContext(GoalContext)
  const { clearCurrentFriend } = useContext(FriendContext)
  const { clearCompetition } = useContext(CompetitionContext)

  useEffect(() => {
    clearCurrentGoal()
    clearCurrentFriend()
    clearCompetition()
    //eslint-disable-next-line
  }, [])

  return (
    <div className='grid-2'>
      <Goals/>
      <div>
        <Notifications/>
        <Friends/>
      </div>
    </div>
  )
}

export default Home