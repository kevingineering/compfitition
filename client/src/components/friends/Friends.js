import React from 'react';

const Friends = () => {
  return (
    <ul className='collection with-header'>
      <li className='collection-header'><h5>Friends!</h5></li>
      {friends === null ? <h4>Loading...</h4> : (
          friends.map(friend => <FriendItem friend={friend} key={friend.id} />)
      )}
    </ul>
  )
}

export default Friends;