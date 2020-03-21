import React, { useReducer } from 'react'
import axios from 'axios'
import AuthContext from './authContext'
import AuthReducer from './authReducer'
import setAuthToken from '../../utils/setAuthToken'
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
  CLEAR_AUTH_ERROR
} from '../types'

const AuthState = props => {
  const initialState = { 
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null,
    userError: null,
    userLoading: false
  }

  const [state, dispatch] = useReducer(AuthReducer, initialState)

  //used for requests sending data
  const config = { 
    headers: { 
      'Content-Type': 'application/json'
    }
  }

  //get user data
  const getUser = async () => {
    //console.log('getUser')
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    try {
      setLoading()
      const res = await axios.get('/api/users')
      dispatch({ type: USER_LOADED, payload: res.data })
    } catch (err) {
      dispatch({ type: AUTH_ERROR, payload: err.response.data.msg })
    }
  }

  //log in user
  const loginUser = async formData => {
    //console.log('loginUser')
    try {
      setLoading()
      const res = await axios.post('/api/users/login', formData, config)
      dispatch({ type: LOGIN_SUCCESS, payload: res.data })
      getUser()
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg })
    }
  }

  //register new user
  const registerUser = async formData => {
    //console.log('registerUser')
    try {
      setLoading()
      const res = await axios.post('/api/users/register', formData, config)
      dispatch({ type: REGISTER_SUCCESS, payload: res.data })
      getUser()
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg })
    }
  }
  
  //update user
  const updateUser = async user => {
    //console.log('updateUser')
    try {
      setLoading()
      const res = await axios.patch(`/api/users/${user._id}`, user, config)
      dispatch({ type: UPDATE_SUCCESS, payload: { user: res.data.user, msg: res.data.msg }})
    } catch (err) {
      dispatch({ type: UPDATE_FAIL, payload: err.response.data.msg })
    }
  }

  //change user password
  const changeUserPassword = async (formData, userId) => {
    //console.log('changeUserPassword')
    try { 
      setLoading()
      const res = await axios.patch(`/api/users/password/${userId}`, formData, config)
      dispatch({ type: PASSWORD_SUCCESS, payload: res.data.msg })
    } catch (err) {
      dispatch({ type: PASSWORD_FAIL, payload: err.response.data.msg })
    }
  }

  //delete user
  const deleteUser = async (password, userId) => {
    //console.log('deleteUser')
    try {
      setLoading()
      const res = await axios.delete(`/api/users/${userId}`, {
        config,
        data: {
          password
        }
      })
      dispatch({ type: USER_DELETED_SUCCESS, payload: res.data.msg })
    } catch (err) {
      dispatch({ type: USER_DELETED_FAIL, payload: err.response.data.msg })
    }
  }

  //logout
  const logoutUser = () => {
    //console.log('logoutUser')
    dispatch({ type: LOGOUT })
  }

  //set loading
  const setLoading = () => {
    //console.log('setLoading')
    dispatch({ type: SET_AUTH_LOADING })
  }

  //clear error
  const clearUserError = () => {
    //console.log('clearUserError')
    dispatch({ type: CLEAR_AUTH_ERROR })
  }

  return (
    <AuthContext.Provider
    value={{
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      userError: state.userError,
      userLoading: state.userLoading,
      loginUser,
      registerUser,
      updateUser,
      changeUserPassword,
      deleteUser,
      logoutUser,
      clearUserError
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState