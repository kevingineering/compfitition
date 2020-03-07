import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RequestContext from '../../../contexts/requests/requestContext';
import FriendContext from '../../../contexts/friends/friendContext';
import userimg from '../../../resources/userimg.png';

const FriendRequest = ({ request: {requester, firstName, lastName, email }}) => {
  
  console.log('FriendRequest')
  
  //originally had each button a different color, changed them to all black/white

  const requestContext = useContext(RequestContext);
  const { deleteRequest } = requestContext;

  const friendContext = useContext(FriendContext);
  const { addFriend } = friendContext;

  const handleAccept = e => {
    addFriend(requester);
    deleteRequest(requester);
  }

  const handleReject = e => {
    deleteRequest(requester);
  }

  const avatar = null;

  return (
    <div>
      <li className='search-item'>
        <p className='center btn-primary'>
          {firstName} sent you a friend request!
        </p>
        <div className='search-link'>
          <div className="flex">
            <img
              src={avatar !== null ? avatar : userimg}
              alt={firstName.charAt(0)}
            />
          </div>
          <div className='search-container'>
            <span className='search-name'>{firstName} {lastName}</span>
            <br/>
            <span className='search-email'>{email}</span>
          </div>
          <div className='right'>
            <button
              className='search-btn btn-primary block'
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className='search-btn btn-primary block'
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      </li>
    </div>
  )
}

FriendRequest.propTypes = {
  request: PropTypes.object.isRequired
}

export default FriendRequest;