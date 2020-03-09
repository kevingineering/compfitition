import React from 'react';
import PropTypes from 'prop-types';
import GoalItem from './GoalItem';

const GoalList = ({goals, isOwner, isGoal, loading}) => {
  
 //console.log{'GoalList')

  //create list
  let itemList = null;

  let type = isGoal ? 'goals' : 'competitions';

  if (loading) {
    itemList = (
      <li className='collection-item'>
        Loading...
      </li>
    )
  }
  else if (goals.length === 0) {
    itemList = (
      <li className='collection-item center collection-item-block'>
        <p className='width-250'>
          {isOwner ? 
            `You have no ${type}... ` :
            `This user has no public ${type}.`
          }
          <br/>
          {isOwner ? 
            "It's okay, add one below!":
            null
          }
        </p>
      </li>
    );
  }
  else {
    itemList = (
      <React.Fragment>
        {goals.map(goal => 
          <GoalItem 
            goal={goal} 
            key={goal._id} 
            isOwner={isOwner}
            isGoal={isGoal}
          />)}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {itemList}
    </React.Fragment>
  )
}

GoalList.propTypes = {
  goals: PropTypes.array.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isGoal: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
}

export default GoalList;