import {
  GET_USER_GOALS,
  //GET_PUBLIC_GOALS,
  //GET_FRIEND_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
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
        goalsOfUser: action.payload,
        goalsLoading: false
      }
    case ADD_GOAL:
      return {
        ...state,
        goalsOfUser: [...state.goalsOfUser, action.payload],
        goalsLoading: false
      }
    case DELETE_GOAL:
      return {
        ...state,
        goalsOfUser: state.goalsOfUser.filter(goal => goal._id !== action.payload),
        goalsLoading: false
      }
    case UPDATE_GOAL:
    case UPDATE_GOAL_TRACKER:
      return {
        ...state,
        goalsOfUser: state.goalsOfUser.map(goal => 
          goal._id === action.payload._id ? action.payload : goal),
          goalsLoading: false
      }
    case SET_GOAL_LOADING:
      return {
        ...state,
        goalsLoading: true
      }
    case GOAL_ERROR:
      return {
        ...state,
        goalsError: action.payload,
        goalsLoading: false
      }
    case CLEAR_GOAL_ERRORS:
      return {
        ...state,
        goalsError: null
      }
    case SET_CURRENT_GOAL:
      return {
        ...state,
        goalCurrent: state.goalsOfUser.find(goal => goal._id === action.payload)
      }
    case CLEAR_CURRENT_GOAL:
      return {
        ...state,
        goalCurrent: {}
      }
    case CLEAR_GOALS:
      return { 
        ...state,
        goalsOfUser: [],
        goalsOfPublic: [],
        goalsOfFriends: [],
        goalCurrent: {},
        goalsError: null,
        goalsLoading: true
      }
    default: 
      return state;
  }
}