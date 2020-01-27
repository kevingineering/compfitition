import {
  GET_USER_GOALS,
  //GET_PUBLIC_GOALS,
  //GET_FRIEND_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  DELETE_GOALS,
  UPDATE_GOAL,
  UPDATE_GOAL_TRACKER,
  SET_CURRENT_GOAL,
  CLEAR_CURRENT_GOAL,
  SET_GOAL_LOADING,
  GOAL_ERROR,
  CLEAR_GOAL_ERRORS,
  CLEAR_GOALS
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case GET_USER_GOALS:
      return {
        ...state, 
        userGoals: action.payload,
        loading: false
      }
    case ADD_GOAL:
      return {
        ...state,
        userGoals: [...state.userGoals, action.payload],
        loading: false
      }
    case DELETE_GOAL:
      return {
        ...state,
        userGoals: state.userGoals.filter(goal => goal._id !== action.payload),
        loading: false
      }
    case UPDATE_GOAL:
    case UPDATE_GOAL_TRACKER:
      return {
        ...state,
        userGoals: state.userGoals.map(goal => 
          goal._id === action.payload._id ? action.payload : goal),
        loading: false
      }
    case SET_GOAL_LOADING:
      return {
        ...state,
        loading: true
      }
    case GOAL_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_GOAL_ERRORS:
      return {
        ...state,
        error: null
      }
    case SET_CURRENT_GOAL:
      return {
        ...state,
        current: state.userGoals.find(goal => goal._id === action.payload)
      }
    case CLEAR_CURRENT_GOAL:
      return {
        ...state,
        current: {}
      }
    case DELETE_GOALS:
    case CLEAR_GOALS:
      return { 
        ...state,
        userGoals: [],
        publicGoals: [],
        friendGoals: [],
        current: {},
        error: null,
        loading: true
      }
    default: 
      return state;
  }
}