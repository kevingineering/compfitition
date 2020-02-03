import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const Login = props => {
  const authContext = useContext(AuthContext);
  const { loginUser, userError, clearUserErrors, isAuthenticated } = authContext;

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
  }, [isAuthenticated, userError, props.history]);

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
        <div className="form-group">
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            value={email}
            name='email'
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            value={password}
            name='password'
            onChange={handleChange}
            autoComplete='currentPassword'
          />
        </div>
        <input 
          type='submit'
          value='Log In'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  )
}

export default Login;