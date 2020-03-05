import React, { useContext, useState, useEffect } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import FriendList from '../user/FriendList';

const FriendFriends = () => {
  const friendContext = useContext(FriendContext);
  const { friendCurrent, getCurrentFriendFriends, friendCurrentFriends, friendsLoading } = friendContext;
  
  const [isFriendsOpen, setIsFriendsOpen] = useState(true);

  useEffect(() => {
    getCurrentFriendFriends(friendCurrent._id);
    //eslint-disable-next-line
  }, [friendCurrent])

  return (
    <ul className='collection'>
      <li className='collection-header header-with-btn'>
        <h2>{friendCurrent.firstName}'s Friends!</h2>
        <button 
          className='btn btn-primary right'
          onClick={() => setIsFriendsOpen(prevState => !prevState)}
        >
          <i className={isFriendsOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
        </button>
      </li>
      {isFriendsOpen &&
        <React.Fragment>
          <FriendList 
            friends={friendCurrentFriends} 
            loading={friendsLoading}
            filtered={null}
            isOwner={false}
          />
        </React.Fragment>
      }
    </ul>
  );
};

export default FriendFriends;