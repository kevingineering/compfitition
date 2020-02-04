import React, { useContext } from 'react';
import GoalContext from '../../contexts/goals/goalContext';
import GoalItem from './GoalItem';
import PropTypes from 'prop-types';

const GoalList = ({goals, isOwner}) => {
  const goalContext = useContext(GoalContext);
  const { goalsLoading } = goalContext;
  
  //create list
  let itemList = null;

  if (goalsLoading) {
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
            'You have no goals... ' :
            'This user has no goals.'
          }
          <br/>
          {isOwner ? 
            "I'm not judging, but you should add a few to make us both feel better." :
            'Invite them to join you in a competition!'
          }
        </p>
      </li>
    );
  }
  else {
    itemList = (
      <React.Fragment>
        {goals.map(goal => <GoalItem goal={goal} key={goal._id} isOwner={isOwner}/>)}
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
  isOwner: PropTypes.bool.isRequired
}

export default GoalList;