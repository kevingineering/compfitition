import React, { useContext } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import GoalPassFail from '../../goals/GoalPassFail';
import GoalTotal from '../../goals/GoalTotal';
import GoalDifference from '../../goals/GoalDifference';

const FriendGoalPage = props => {
  const friendContext = useContext(FriendContext);
  const { friendCurrentGoal } = friendContext;

  const { name, type } = friendCurrentGoal;
  //!Object.entries(friendCurrentGoal).length && props.history.goBack();

  return (
    <div className='form-container'>
    {!Object.entries(friendCurrentGoal).length ? (
      <h2>Loading...</h2>
    ) : (
      <React.Fragment>
        <h2 className='collection-header'>{name}</h2>
        {type === 'pass/fail' && 
          <GoalPassFail goal={friendCurrentGoal} handleSave={null} isOwner={false}/>}
        {type === 'total' && 
          <GoalTotal goal={friendCurrentGoal} handleSave={null} isOwner={false}/>}
        {type === 'difference' && 
          <GoalDifference goal={friendCurrentGoal} handleSave={null} isOwner={false}/>}
        <p className='lrb-border'/>
      </React.Fragment>
    )}
    </div>
  )
}

export default FriendGoalPage;