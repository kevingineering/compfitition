import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const Register = props => {
  const authContext = useContext(AuthContext);
  const { registerUser, error, clearUserErrors, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlerts } = alertContext;

  //redirect if authenticated, set alert if error
  useEffect(() => {
    if (isAuthenticated)
      props.history.push('/');

    if (error) {
      setAlert(error);
      clearUserErrors();
    }
    //eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  //clear alerts before redirect
  useEffect(() => {
    return () => {
      clearAlerts();
    }
  }, []);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    searchable: true,
    email: '',
    password: '',
    password2: ''
  });

  const { firstName, lastName, alias, searchable, email, password, password2 } = user;

  const handleSubmit = async e => {
    e.preventDefault();
    clearAlerts();
    if (password !== password2)
      setAlert('Passwords do not match.');
    else await registerUser(user);
  }

  const handleChange = e => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  const handleClick = e => {
    setUser({ ...user, searchable: !searchable });
  };

  return (
    <div className='form-container'>
      <h1>Account Register</h1>
      <form onSubmit={handleSubmit}>
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
        {/*Password*/}
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            value={password}
            name='password'
            onChange={handleChange}
          />
        </div>
        {/*Confirm Password*/}
        <div className="form-group">
          <label htmlFor='password2'>Confirm Password</label>
          <input
            type='password'
            value={password2}
            name='password2'
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
        {/*Submit Button*/}
        <input 
          type='submit'
          value='Register'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Register;