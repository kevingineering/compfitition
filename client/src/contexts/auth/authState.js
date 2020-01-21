import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  UPDATE_SUCCESS,
  UPDATE_FAIL,
  PASSWORD_SUCCESS,
  PASSWORD_FAIL,
  USER_DELETED_SUCCESS,
  USER_DELETED_FAIL,
  SET_AUTH_LOADING,
  CLEAR_AUTH_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = { 
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //used for requests sending data
  const config = { 
    headers: { 
      'Content-Type': 'application/json'
    }
  };

  //get user data
  const getUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      setLoading();
      const res = await axios.get('/api/auth');
      dispatch({ type: USER_LOADED, payload: res.data })
    } catch (err) {
      console.log(err);
      dispatch({ type: AUTH_ERROR, payload: err.response.data.msg });
    }
  };

  //log in user
  const loginUser = async formData => {
    try {
      setLoading();
      const res = await axios.post('/api/auth', formData, config);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      getUser();
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg });
    }
  };

  //register new user
  const registerUser = async formData => {
    try {
      setLoading();
      const res = await axios.post('/api/users', formData, config);
      dispatch({ type: REGISTER_SUCCESS, payload: res.data });
      getUser();
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
    }
  };
  
  //update user
  const updateUser = async user => {
    try {
      setLoading();
      const res = await axios.put(`/api/auth/${user._id}`, user, config);
      dispatch({ type: UPDATE_SUCCESS, payload: { user: res.data.user, msg: res.data.msg }});
    } catch (err) {
      dispatch({ type: UPDATE_FAIL, payload: err.response.data.msg });
    }
  };

  //change user password
  const changeUserPassword = async (formData, _id) => {
    try { 
      setLoading();
      const res = await axios.put(`/api/auth/password/${_id}`, formData, config);
      dispatch({ type: PASSWORD_SUCCESS, payload: res.data.msg });
    } catch (err) {
      dispatch({ type: PASSWORD_FAIL, payload: err.response.data.msg });
    }
  };

  //delete user
  const deleteUser = async (password, _id) => {
    try {
      setLoading();
      const res = await axios.delete(`/api/auth/${_id}`, {
        config,
        data: {
          password
        }

      });
      dispatch({ type: USER_DELETED_SUCCESS, payload: res.data.msg });
    } catch (err) {
      dispatch({ type: USER_DELETED_FAIL, payload: err.response.data.msg });
    }
  };

  //logout
  const logoutUser = () => {
    dispatch({ type: LOGOUT });
  };

  //set loading
  const setLoading = () => {
    dispatch({ type: SET_AUTH_LOADING });
  };

  //clear erros
  const clearUserErrors = () => {
    dispatch({ type: CLEAR_AUTH_ERRORS });
  };

  return (
    <AuthContext.Provider
    value={{
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error,
      loading: state.loading,
      getUser,
      loginUser,
      registerUser,
      updateUser,
      changeUserPassword,
      deleteUser,
      logoutUser,
      clearUserErrors
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState;