import {
  GET_GOALS,
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
    case GET_GOALS:
      return {
        ...state, 
        goals: action.payload,
        goalsLoading: false
      }
    case ADD_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload],
        goalsLoading: false
      }
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        goalsLoading: false
      }
    case UPDATE_GOAL:
    case UPDATE_GOAL_TRACKER:
      return {
        ...state,
        goals: state.goals.map(goal => 
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
        goalCurrent: state.goals.find(goal => goal._id === action.payload)
      }
    case CLEAR_CURRENT_GOAL:
      return {
        ...state,
        goalCurrent: {}
      }
    case CLEAR_GOALS:
      return { 
        ...state,
        goals: [],
        goalCurrent: {},
        goalsError: null,
        goalsLoading: true
      }
    default: 
      return state;
  }
}