import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FriendContext from '../../../contexts/friends/friendContext';
import FriendSearchbar from './FriendSearchbar';
import FriendRequests from './FriendRequests';
import FriendList from './FriendList';

const Friends = () => {

 //console.log{'Friends')

  const friendContext = useContext(FriendContext);
  const { getFriends, friends, friendsFiltered, friendsLoading } = friendContext;
  
  const [isFriendsOpen, setIsFriendsOpen] = useState(true);
  useEffect(() => {
    getFriends();
    //eslint-disable-next-line
  }, []);

  return (
    <ul className='collection'>
      <li className='collection-header header-with-btn'>
        <h2>Friends!</h2>
        <button 
          className='btn btn-primary right'
          onClick={() => setIsFriendsOpen(prevState => !prevState)}
        >
          <i className={isFriendsOpen ? 'fas fa-minus' : 'fas fa-plus'}/>
        </button>
      </li>
      {isFriendsOpen &&
        <React.Fragment>
          <FriendRequests />
          <FriendSearchbar />
          <FriendList 
            friends={friends} 
            filtered={friendsFiltered}
            loading={friendsLoading}
            isOwner={true}
          />
          <li className='collection-footer'>
            <Link to='/search' className='text-secondary'>
              <p className='padding-04'>
                <i className='fas fa-plus'/> Add Friend
              </p>
            </Link>
          </li>
        </React.Fragment>
      }
    </ul>
  );
};

export default Friends;