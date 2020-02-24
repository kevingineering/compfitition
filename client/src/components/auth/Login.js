import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';
import Input from '../formComponents/Input';

const Login = () => {
  const authContext = useContext(AuthContext);
  const { loginUser, userError, clearUserErrors, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert, clearAlert } = alertContext;

  let history = useHistory();

  //redirect if authenticated, set alert if error
  useEffect(() => {
    if (isAuthenticated)
      history.push('/');

    if (userError) {
      setAlert(userError);
      clearUserErrors();
    }
    //eslint-disable-next-line
  }, [isAuthenticated, userError]);

  //clear alert before redirect
  useEffect(() => {
    return () => {
      clearAlert();
    }
    //eslint-disable-next-line
  }, []);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const handleSubmit = async e => {
    e.preventDefault();
    await loginUser(user);
  }

  const handleChange = e => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  return (
    <div className='form-container'>
      <h1>Account Login</h1>
      <form onSubmit={handleSubmit}>
        {/*Email*/}
        <Input
          label='Email Address'
          type='email'
          value={email}
          name='email'
          handleChange={handleChange}
        />
        {/*Password*/}
        <Input
          label='Password'
          type='password'
          value={password}
          name='password'
          handleChange={handleChange}
        />
        <input 
          type='submit'
          value='Log In'
        />
      </form>
    </div>
  )
}

export default Login;