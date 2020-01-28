import React from 'react';
import { Link } from 'react-router-dom';
import FriendContext from '../../contexts/friends/friendContext';
import FriendItem from './FriendItem';

const Friends = () => {
  const friends = [];
  return (
    <React.Fragment>
      <ul className='collection'>
        <li className='collection-header'>
          <h2>Friends!</h2>
        </li>
        {friends === null ? <h4>Loading...</h4> : (
            friends.map(friend => <FriendItem friend={friend} key={friend.id} />)
        )}
        <li className='collection-footer'>
          <Link to='/search' className='text-sedondary'>
            <p><i className='fas fa-plus'/> Add Friend</p>
          </Link>
        </li>
      </ul>
    </React.Fragment>
  )
}

export default Friends;