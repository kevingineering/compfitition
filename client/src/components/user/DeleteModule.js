import React from 'react';
import PropTypes from 'prop-types';
import Input from '../formComponents/Input';

const DeleteModule = ({current, handleChange, setDeleteToggle, setAlert, deleteUser}) => {

 //console.log{'DeleteModule')

  const { _id, oldPassword } = current;

  const handleDelete = async () => {
    if (oldPassword === '')
      setAlert('Please enter your password.');
    else {
      await deleteUser(oldPassword, _id);
    }
  }

  return (
    <form autoComplete='off'>
      <span>Deleting your account cannot be undone and your information cannot be recovered. Any goals, competitions, or friendships you have will be permanently lost. Are you sure you want to delete your account?</span>
      <Input
        type='password'
        value={oldPassword}
        name='oldPassword'
        label='Password'
        handleChange={handleChange}
      />
      <input
          type='button'
          value='No, keep my account.'
          className='btn btn-block btn-primary'
          onClick={() => setDeleteToggle(false)}
      />
      <input
          type='button'
          value='Yes, delete my account.'
          className='btn btn-danger btn-block'
          onClick={handleDelete}
        />
    </form>
  )
}

DeleteModule.propTypes = {
  current: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  setDeleteToggle: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
}

export default DeleteModule;