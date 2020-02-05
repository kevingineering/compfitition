import React from 'react';
import FriendItem from './FriendItem';
import PropTypes from 'prop-types';

const FriendList = ({friends, loading, filtered, isOwner}) => {
  //populate list
  let listItems = '';

  if (loading) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        Loading...
      </li>
    );
  }
  else if (friends.length === 0) {
    listItems = (
      <li className='collection-item center collection-item-block'>
        {isOwner ? 
          'You have no friends ... awkward :/' :
          'This user has no other friends, but they have you.'
        }
        <br/>
        {isOwner ? 
          "It's okay, click below to find some!" :
          null
        }
      </li>
    );
  }
  else if (filtered !== null) {
    filtered === [] ? (
      listItems = (
        <li className='collection-item center collection-item-block'>
          None of your friends match this search criteria.
        </li>
      )
    ) : (
      listItems = (
        <React.Fragment>
          {filtered.map(friend => <FriendItem friend={friend} key={friend._id} />)}
        </React.Fragment>
      )
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
    <React.Fragment>
      {listItems}
    </React.Fragment>
  )
}

FriendList.propTypes = {
  friends: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  filtered: PropTypes.array,
  isOwner: PropTypes.bool.isRequired
}

export default FriendList;