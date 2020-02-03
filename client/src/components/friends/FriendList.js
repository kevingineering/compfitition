import React, { useContext } from 'react';
import FriendContext from '../../contexts/friends/friendContext';
import FriendItem from './FriendItem';

const FriendList = () => {
  const friendContext = useContext(FriendContext);
  const { friends, friendsFiltered, friendsLoading } = friendContext;

  //populate list
  let listItems = '';
  if (friendsLoading) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        Loading...
      </li>
    );
  }
  else if (friends.length === 0) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        You have no friends ... awkward :/
        <br/>
        It's okay, click below to find some!
      </li>
    );
  }
  else if (friendsFiltered !== null) {
    listItems = (
      <React.Fragment>
        {friendsFiltered.map(friend => <FriendItem friend={friend} key={friend._id} />)}
      </React.Fragment>
    )
  }
  else {
    listItems = (
      <React.Fragment>
        {friends.map(friend => <FriendItem friend={friend} key={friend._id} />)}
      </React.Fragment>
    )
  }

  return (
    <div>
      {listItems}
    </div>
  )
}

export default FriendList;