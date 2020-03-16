import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import FriendContext from '../../../contexts/friends/friendContext';

const DeleteFriend = ({userId})=> {

 //console.log{'DeleteFriend')

  const friendContext = useContext(FriendContext);
  const { deleteFriend } = friendContext;

  const [deleteToggle, setDeleteToggle] = useState(false);

  let history = useHistory();

  const handleDelete = () =>  {
    deleteFriend(userId);
    history.push('/');
  }

  return (
    <div>
      <form className='width-275'>
        <input
          type='button'
          value='Delete Friendship?'
          className='btn btn-block btn-primary btn-h2 margin-0'
          onClick={() => setDeleteToggle(true)}
        />
        {deleteToggle && (
          <div className='block'>
            <p className='lr-border center search-email'>
              <strong>Are you sure you want to delete this friendship?</strong>
            </p>
            <input
              type='button'
              value='No'
              className='btn btn-primary btn-split margin-0'
              onClick={() => setDeleteToggle(false)}
            />
            <input
              type='button'
              value='Yes'
              className='btn btn-danger btn-split margin-0'
              onClick={handleDelete}
            />
          </div>
        )}
      </form>
    </div>
  )
}

DeleteFriend.propTypes = {
  userId: PropTypes.string.isRequired
}

export default DeleteFriend;