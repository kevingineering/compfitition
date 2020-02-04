import React, { useContext } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import FriendItem from '../FriendItem';

const FriendFriendList = () => {

  const friendContext = useContext(FriendContext);
  const { friendCurrentFriends, friendsLoading } = friendContext;

  //populate list
  let listItems = '';
  if (friendsLoading) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        Loading...
      </li>
    );
  }
  else if (friendCurrentFriends.length === 0) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        This user currently has no other friends, but they've got you!
      </li>
    );
  }
  else {
    listItems = (
      <React.Fragment>
        {friendCurrentFriends.map(friend => 
          <FriendItem friend={friend} key={friend._id} />)}
      </React.Fragment>
    )
  }

  return (
    <div>
      {listItems}
    </div>
  )
}

export default FriendFriendList;