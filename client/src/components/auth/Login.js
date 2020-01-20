import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/auth/authContext';
import AlertContext from '../../contexts/alerts/alertContext';

const Login = props => {
  const authContext = useContext(AuthContext);
  const { loginUser, error, clearUserErrors, isAuthenticated } = authContext;

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
  }, [isAuthenticated, error, props.history]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const handleSubmit = e => {
    e.preventDefault();
    clearAlerts();
    loginUser(user);
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            value={password}
            name='password'
            onChange={handleChange}
            required
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