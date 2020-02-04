import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import FriendContext from '../../../contexts/friends/friendContext';

const DeleteFriend = ({_id})=> {
  const friendContext = useContext(FriendContext);
  const { deleteFriend } = friendContext;

  const [deleteToggle, setDeleteToggle] = useState(false);

  let history = useHistory();

  const handleDelete = () =>  {
    deleteFriend(_id);
    history.push('/');
  }

  return (
    <div>
      <form>
        <input
          type='button'
          value='Delete Friend?'
          className='btn btn-primary btn-block btn-h2'
          onClick={() => setDeleteToggle(true)}
        />
        {deleteToggle && (
          <React.Fragment>
            <p className='center'>
              <strong>Are you sure you want to delete this friendship?</strong>
            </p>
            <input
              type='button'
              value='No'
              className='btn btn-primary btn-block'
              onClick={() => setDeleteToggle(false)}
            />
            <input
              type='button'
              value='Yes'
              className='btn btn-danger btn-block'
              onClick={handleDelete}
            />
          </React.Fragment>
        )}
      </form>
    </div>
  )
}

export default DeleteFriend;