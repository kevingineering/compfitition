import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const UserPage = () => {
  const authContext = useContext(AuthContext);
  const { user, updateUser, changeUserPassword, deleteUser, userError, clearUserErrors } = authContext;
  
  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;
  
  const [current, setCurrent] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    isSearchable: true,
    email: '',
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
  });
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [deleteToggle, setDeleteToggle] = useState(false);
  
  const { _id, firstName, lastName, alias, isSearchable, email, oldPassword, newPassword, newPassword2} = current;

  //populate current with user values
  useEffect(() => {
    setCurrent({...current, ...user});
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  },[user]);

  //set alert if error
  useEffect(() => {
    if(userError === 'User updated!') {
      setEditToggle(false);
    }
    else if (userError === 'Password changed!') {
      setPasswordToggle(false);
      setCurrent({...current, oldPassword: '', newPassword: '', newPassword2: ''});
    }
    else if (userError === 'User deleted.') {
      setDeleteToggle(false);
    }
    if (userError) {
      setAlert(userError);
    }
    //eslint-disable-next-line
  }, [userError]);

  //clear errors before redirect
  useEffect(() => {
    return () => {
      clearUserErrors();
    }
    //eslint-disable-next-line
  }, []);

  const handlePassword = async () => {
    if (newPassword !== newPassword2)
      setAlert('Passwords do not match.');
    else {
      await changeUserPassword({oldPassword, newPassword, newPassword2}, _id);
    }
  };

  const handleEdit = async () => {
    if (firstName === '') 
      setAlert('Please enter a first name.');
    else if (lastName === '')
      setAlert('Please enter a last name.');
    else if (email === '')
      setAlert('Please enter an email.');
    else {
      await updateUser(current);
    }
    setEditToggle(!editToggle);
  };

  const handleDelete = async () => {
    if (oldPassword === '')
      setAlert('Please enter your password.');
    else {
      await deleteUser(oldPassword, current._id);
    }
  }

  const handleChange = e => {
    setCurrent({...current, [e.target.name]: e.target.value});
  };
  
  const handleClick = () => {
    setCurrent({ ...current, isSearchable: !isSearchable });
  };

  return (
    <div className='form-container'>
      <h1>User Profile</h1>
      {/*Edit module*/}
      {editToggle && (
      <form autoComplete='off'>
        {/*First Name*/}
        <div className="form-group">
          <label htmlFor='firstName'>First Name</label>
          <input
            type='text'
            value={firstName}
            name='firstName'
            onChange={handleChange}
          />
        </div>
        {/*Last Name*/}
        <div className="form-group">
          <label htmlFor='lastName'>Last Name</label>
          <input
            type='text'
            value={lastName}
            name='lastName'
            onChange={handleChange}
          />
        </div>
        {/*Alias*/}
        <div className="form-group">
          <label htmlFor='alias'>Alias (optional - the name your friends will see)</label>
          <input
            type='text'
            value={alias}
            name='alias'
            onChange={handleChange}
          />
        </div>
        {/*Email Address*/}
        <div className="form-group">
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            value={email}
            name='email'
            onChange={handleChange}
          />
        </div>
        {/*Privacy*/}
        <div className="form-group">
          <label className='block'>Privacy</label>
          <label className='switch'>
            <input
              type='checkbox'
              checked={isSearchable}
              name='isSearchable'
              onChange={handleClick}
            />
            <span className='slider round'/>
          </label>
          <span className='register-span'>Are other users allowed to search for your name and email? This is how friends will find you.</span>
        </div>
        {/*Save Button*/}
        <input 
          type='button'
          value='Save User'
          className='btn btn-primary btn-block'
          onClick={handleEdit}
        />
        <input
          type='button'
          value='Cancel'
          className='btn btn-primary btn-block'
          onClick={() => setEditToggle(!editToggle)}
        />
      </form>
      )}
      {/*Password module*/}
      {passwordToggle && (
      <form autoComplete='off'>
        {/*Old password*/}
        <div className="form-group">
          <label htmlFor='oldPassword'>Current Password</label>
          <input
            type='password'
            value={oldPassword}
            name='oldPassword'
            onChange={handleChange}
          />
        </div>
        {/*New Password*/}
        <div className="form-group">
          <label htmlFor='newPassword'>New Password</label>
          <input
            type='password'
            value={newPassword}
            name='newPassword'
            onChange={handleChange}
          />
        </div>
        {/*New Password 2*/}
        <div className="form-group">
          <label htmlFor='newPassword2'>Verify New Password</label>
          <input
            type='password'
            value={newPassword2}
            name='newPassword2'
            onChange={handleChange}
          />
        </div>
        {/*Save Button*/}
        <input
          type='button'
          value='Change Password'
          className='btn btn-primary btn-block'
          onClick={handlePassword}
        />
        {/*Cancel Button*/}
        <input
          type='button'
          value='Cancel'
          className='btn btn-primary btn-block'
          onClick={() => setPasswordToggle(false)}
        />
      </form>
      )}
      {/*Delete module*/}
      {deleteToggle && (
      <form autoComplete='off'>
        <span>Deleting your account cannot be undone and your information cannot be recovered. Any goals, competitions, or friendships you have will be permanently lost. Are you sure you want to delete your account?</span>
        <div className="form-group">
          <label htmlFor='oldPassword'>Password</label>
          <input
            type='password'
            value={oldPassword}
            name='oldPassword'
            onChange={handleChange}
          />
        </div>
        <input
            type='button'
            value='No, keep my account.'
            className='btn btn-primary btn-block'
            onClick={() => setDeleteToggle(false)}
          />
        <input
            type='button'
            value='Yes, delete my account.'
            className='btn btn-danger btn-block'
            onClick={handleDelete}
          />
      </form>
      )}
      {/*User Information, Edit, Change Password, and Delete Button*/}
      {!editToggle && !passwordToggle && !deleteToggle && (
        <React.Fragment>
          <p>
            <strong>Name: &nbsp;&nbsp;&nbsp;</strong>
            {firstName} {lastName}
          </p>
          <p>
            <strong>Alias: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
            {alias !== '' ? alias : 'none'}
          </p>
          <p>
            <strong>Email: &nbsp;&nbsp;&nbsp;&nbsp;</strong>
            {email}
          </p>
          <p>
            <strong>Privacy: &nbsp;</strong>
            Other users {isSearchable ? 'can' : 'cannot'} search for me using my name and email.
          </p>
          <input
            type='button'
            value='Edit User'
            className='btn btn-primary btn-block'
            onClick={() => setEditToggle(true)}
          />
          <input
            type='button'
            value='Change Password'
            className='btn btn-primary btn-block'
            onClick={() => setPasswordToggle(true)}
          />
          <input
            type='button'
            value='Delete User'
            className='btn btn-primary btn-block'
            onClick={() => setDeleteToggle(true)}
          />
        </React.Fragment>
      )}
    </div>
  )
}

export default UserPage;