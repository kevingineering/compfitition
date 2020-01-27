import React from 'react';
import { Link } from 'react-router-dom';
import FriendContext from '../../contexts/friends/friendContext';
import FriendItem from './FriendItem';

const Friends = () => {
  return (
    <ul className='collection'>
      <li className='collection-header'><h5>Friends!</h5></li>
      {friends === null ? <h4>Loading...</h4> : (
          friends.map(friend => <FriendItem friend={friend} key={friend.id} />)
      )}
    </ul>
  )
}

export default Friends;