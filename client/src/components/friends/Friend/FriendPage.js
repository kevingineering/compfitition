import React, { useContext, useEffect } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import FriendGoals from './FriendGoals';
import FriendFriends from './FriendFriends';
import DeleteFriend from './DeleteFriend';

const FriendPage = props => {
  const friendContext = useContext(FriendContext);
  const { friendIds, getCurrentFriendGoals } = friendContext;

  useEffect(() => {
    //redirect if users are not friends
    if(!friendIds.includes(props.match.params.id)) {
      props.history.goBack();
    }

    //get friend goals and friends
    getCurrentFriendGoals(props.match.params.id);
    
    //eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div className='grid-2'>
        <FriendGoals/>
        <FriendFriends/>
      </div>
      <DeleteFriend _id={props.match.params.id}/>
    </React.Fragment>
  )
};

export default FriendPage;