import React, { useContext, useEffect } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import FriendGoals from './FriendGoals';
import FriendFriends from './FriendFriends';
import DeleteFriend from './DeleteFriend';

const FriendPage = props => {
  const friendContext = useContext(FriendContext);
  const { friendIds, friendCurrent } = friendContext;

  useEffect(() => {
    //redirect if users are not friends
    if(!friendIds.includes(friendCurrent._id)) {
      props.history.goBack();
    }
    //eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div className='grid-2'>
        <FriendGoals/>
        <FriendFriends/>
      </div>
      <DeleteFriend _id={friendCurrent._id}/>
    </React.Fragment>
  )
};

export default FriendPage;