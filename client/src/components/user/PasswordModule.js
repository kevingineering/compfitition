import React from 'react';
import PropTypes from 'prop-types';
import Input from '../formComponents/Input';

const PasswordModule = ({current, handleChange, setPasswordToggle, setAlert, changeUserPassword}) => {

 //console.log{'PasswordModule')

  const { _id, oldPassword, newPassword, newPassword2 } = current;

  const handlePassword = async () => {
    if (newPassword !== newPassword2)
      setAlert('Passwords do not match.');
    else {
      await changeUserPassword({oldPassword, newPassword, newPassword2}, _id);
    }
  };

  return (
    <form autoComplete='off'>
      {/*Old password*/}
      <Input
        type='password'
        value={oldPassword}
        name='oldPassword'
        label='Current Password'
        handleChange={handleChange}
      />
      {/*New Password*/}
      <Input
        type='password'
        value={newPassword}
        name='newPassword'
        label='New Password'
        handleChange={handleChange}
      />
      {/*New Password 2*/}
      <Input
        type='password'
        value={newPassword2}
        name='newPassword2'
        label='Verify New Password'
        handleChange={handleChange}
      />
      {/*Save Button*/}
      <input
        type='button'
        value='Change Password'
        className='btn btn-block btn-primary'
        onClick={handlePassword}
      />
      {/*Cancel Button*/}
      <input
        type='button'
        value='Cancel'
        className='btn btn-block btn-primary'
        onClick={() => setPasswordToggle(false)}
      />
    </form>
  )
}

PasswordModule.propTypes = {
  current: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  setPasswordToggle: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  changeUserPassword: PropTypes.func.isRequired
}
export default PasswordModule;