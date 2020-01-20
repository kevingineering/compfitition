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

export default (state, action) => {
  switch(action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        error: null,
        loading: false
      }
    case UPDATE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case UPDATE_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case USER_DELETED_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        loading: false
      }
    case PASSWORD_SUCCESS:
    case PASSWORD_FAIL:
    case USER_DELETED_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case SET_AUTH_LOADING: 
      return {
        ...state,
        loading: true
      }
    case CLEAR_AUTH_ERRORS:
      return {
        ...state,
        error: null
      }
    default: 
      return state
  };
};