import React from 'react';
//import React, { useContext, useEffect } from 'react';
//import { Link } from 'react-router-dom';

const FriendGoals = () => {

  //get friend 'friends' and 'public' goals 
  
  //sort current from past goals

  //


  // const goalContext = useContext(GoalContext);
  // const { getUserGoals, userGoals, loading } = goalContext;
  
  // const [activeGoals, setActiveGoals] = useState([]);
  // const [pastGoals, setPastGoals] = useState([]);

  // useEffect(() => {
  //   getUserGoals();
  //   //eslint-disable-next-line
  // }, []);

  // //determine if there are active and/or past goals
  // useEffect(() => {
  //   let tempActive = userGoals.filter(goal => 
  //     (moment().startOf('day').diff(goal.startDate, 'days') + 1) <= goal.duration);
    
  //   let tempPast = userGoals.filter(goal => 
  //     (moment().startOf('day').diff(goal.startDate, 'days') + 1) > goal.duration);

  //   setActiveGoals(tempActive);
  //   setPastGoals(tempPast);
  // }, [userGoals]);

  // //active goals
  // let activeItems = null;

  // if (loading) {
  //   activeItems = (
  //     <li className='collection-item'>
  //       Loading...
  //     </li>
  //   )
  // }
  // else if (activeGoals.length === 0) {
  //   activeItems = (
  //     <li className='collection-item center collection-item-block'>
  //       <p className='width-250'>
  //         You have no goals. 
  //         <br/>
  //         I'm not judging, but you should add a few to make us both feel better.
  //       </p>
  //     </li>
  //   );
  // }
  // else {
  //   activeItems = (
  //     <React.Fragment>
  //       {activeGoals.map(goal => <GoalItem goal={goal} key={goal._id} />)}
  //     </React.Fragment>
  //   );
  // }

  // //past goals
  // let pastItems = null;

  // if (pastGoals.length !== 0) {
  //   pastItems = (
  //     <React.Fragment>
  //       {pastGoals.map(goal => <GoalItem goal={goal} key={goal._id} />)}
  //     </React.Fragment>
  //   );
  // }

  


  //const name = 'Name';



  return (
    <React.Fragment>
      {/* <ul className='collection'>
        <li className='collection-header'>
          <h2>{name}'s Goals</h2>
        </li>
        {activeItems}
        <li className='collection-footer'>
          <Link to='/goalform' className='text-secondary'>
            <p className='margin-025'><i className='fas fa-plus'/> Add Goal</p>
          </Link>
        </li>
      </ul>
      {pastGoals.length !== 0 && 
        <ul className='collection'>
          <li className='collection-header'>
            <h2>{name}'s Past Goals</h2>
          </li>
          {pastItems}
        </ul>
      } */}
    </React.Fragment>
  )
}

export default FriendGoals;
