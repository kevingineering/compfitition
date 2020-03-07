import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';
import Input from '../formComponents/Input';
import Switch from '../formComponents/Switch';

const Register = () => {

  console.log('Register')

  const authContext = useContext(AuthContext);
  const { registerUser, userError, clearUserError, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  let history = useHistory();

  //redirect if authenticated, set alert if error
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }

    if (userError) {
      setAlert(userError);
      clearUserError();
    }
    //eslint-disable-next-line
  }, [userError, isAuthenticated]);

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
        <Input
          type='text'
          value={firstName}
          name='firstName'
          label='First Name'
          handleChange={handleChange}
        />
        {/*Last Name*/}
        <Input
          type='text'
          value={lastName}
          name='lastName'
          label='Last Name'
          handleChange={handleChange}
        />
        {/*Alias*/}
        <Input
          type='text'
          value={alias}
          name='alias'
          label='Alias (optional - the name your friends will see)'
          handleChange={handleChange}
        />
        {/*Email Address*/}
        <Input
          type='email'
          value={email}
          name='email'
          label='Email Address'
          handleChange={handleChange}
        />
        {/*Password*/}
        <Input
          type='password'
          value={password}
          name='password'
          label='Password'
          handleChange={handleChange}
        />
        {/*Confirm Password*/}
        <Input
          type='password'
          value={password2}
          name='password2'
          label='Confirm Password'
          handleChange={handleChange}
        />
        {/*Privacy*/}
        <Switch 
          label='Privacy'
          isChecked={isSearchable}
          name='isSearchable'
          handleClick={handleClick}
          msgChecked='Other users are allowed to search for my name and email so they can add me as a friend.'
          msgBlank='Other users are not allowed to search for my name and email.'
        />
        {/*Submit Button*/}
        <input 
          type='submit'
          value='Register'
        />
      </form>
    </div>
  );
};

export default Register;