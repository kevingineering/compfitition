import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const Register = props => {
  const authContext = useContext(AuthContext);
  const { registerUser, userError, clearUserErrors, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  //redirect if authenticated, set alert if error
  useEffect(() => {
    if (isAuthenticated)
      props.history.push('/');

    if (userError) {
      setAlert(userError);
      clearUserErrors();
    }
    //eslint-disable-next-line
  }, [userError, isAuthenticated, props.history]);

  //clear alert before redirect
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, []);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    alias: '',
    isSearchable: true,
    email: '',
    password: '',
    password2: ''
  });

  const { firstName, lastName, alias, isSearchable, email, password, password2 } = user;

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== password2)
      setAlert('Passwords do not match.');
    else await registerUser(user);
  }

  const handleChange = e => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  const handleClick = e => {
    setUser({ ...user, isSearchable: !isSearchable });
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
              checked={isSearchable}
              name='isSearchable'
              onChange={handleClick}
            />
            <span className='slider round'/>
          </label>
          <span className='register-span'>
            {isSearchable ? 
              'Other users are allowed to search for my name and email so they can add me as a friend.' : 
              'Other users are not allowed to search for my name and email.'
            }
          </span>
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