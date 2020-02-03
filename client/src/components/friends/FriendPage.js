import React, { useContext, useEffect } from 'react';
import FriendContext from '../../contexts/friends/friendContext';
import FriendGoals from './FriendGoals';
import FriendFriends from './FriendFriends';

const FriendPage = props => {
  const friendContext = useContext(FriendContext);
  const { friendIds, clearCurrentFriend } = friendContext;

  useEffect(() => {
    //redirect if users are not friends
    if(!friendIds.includes(props.match.params.id))
      props.history.push('/');

    //get friend goals
    
    //clear current friend on unmount
    return () => {
      clearCurrentFriend();
    }
  });

  return (
    <div className='grid-2'>
      <FriendGoals/>
      <FriendFriends/>
    </div>
  )
};

export default FriendPage
