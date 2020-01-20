import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const UserPage = () => {
  const authContext = useContext(AuthContext);
  const { user, updateUser, isAuthenticated, error, clearUserErrors } = authContext;
  
  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlerts } = alertContext;
  
  const [current, setCurrent] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    searchable: true,
    email: '',
    password: '',
    newPassword: '',
    newPassword2: ''
  });

  const [changePassword, setChangePassword] = useState(false);
  const [editUser, setEditUser] = useState(false);

  //populate current with user values
  useEffect(() => {
    setCurrent({...current, ...user});
  },[user]);

  //redirect if not authenticated, set alert if error
  useEffect(() => {
    if (error) {
      setAlert(error);
      clearUserErrors();
    }
    //eslint-disable-next-line
  }, [error, isAuthenticated]);


  const { firstName, lastName, alias, searchable, email, password, newPassword, newPassword2} = current;

  const handleDelete = () => {
    //TODO
  };

  const handlePassword = () => {
    //TODO
    if (newPassword !== newPassword2)
      setAlert('Passwords do not match.');
  }

  const handleSave = () => {
    //TODO
    //ENTER PASSWORD TO SAVE CHANGES
    clearAlerts();
    if (firstName === '') 
      setAlert('Please enter a first name.');
    else if (lastName === '')
      setAlert('Please enter a last name.');
    else if (email === '')
      setAlert('Please enter an email.');
    else updateUser(current);
    if (!error) {
      setAlert('User updated!')
      setEditUser(false);
    }
    else setAlert(error);
  }

  const handleChange = e => {
    setCurrent({...current, [e.target.name]: e.target.value});
  }
  
  const handleClick = () => {
    setCurrent({ ...current, searchable: !searchable });
  };

  return (
    <div className='form-container'>
      <h1>User Profile</h1>
      <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et beatae inventore porro non aut incidunt excepturi expedita molestias quod ex unde veniam omnis, fugit corporis saepe placeat sit veritatis itaque?</span>
      {editUser && (
      <form onSubmit={handleSave}>
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
              checked={searchable}
              name='searchable'
              onChange={handleClick}
            />
            <span className='slider round'/>
          </label>
          <span className='register-span'>Are other users allowed to search for your name, email, and alias? This is how friends will find you.</span>
        </div>
        {/*Save Button*/}
        <input 
          type='button'
          value='Save User'
          className='btn btn-primary btn-block'
          onClick={handleSave}
        />
      </form>
      )}
      {/*Edit, Change Password, and Delete Button*/}
      {!editUser && !changePassword && (
        <React.Fragment>
          <input
            type='button'
            value='Edit User'
            className='btn btn-primary btn-block'
            onClick={() => setEditUser(true)}
          />
          <input
            type='button'
            value='Change Password'
            className='btn btn-primary btn-block'
            onClick={() => setChangePassword(true)}
          />
          <input
            type='button'
            value='Delete User'
            className='btn btn-danger btn-block'
            onClick={handleDelete}
          />
        </React.Fragment>
      )}
    </div>
  )
}

export default UserPage;