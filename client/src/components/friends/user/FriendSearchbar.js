import React, { useRef, useContext } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';

const FriendSearchbar = () => {

  console.log('FriendSearchbar')

  const friendContext = useContext(FriendContext);
  const { filterFriends, clearFriendsFilter } = friendContext;

  const text = useRef('');

  const handleChange = e => {
    if (text.current.value)
      filterFriends(e.target.value)
    else
      clearFriendsFilter();
  }

  return (
    <form>
      <input
        className='margin-0 no-top-border'
        type='text'
        ref={text}
        placeholder='Search Friends'
        onChange={handleChange}
      />
    </form>
  )
}

export default FriendSearchbar;