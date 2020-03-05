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
  CLEAR_GOALS,
  CLEAR_GOALS_ERROR
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
        goalCurrent: action.payload,
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
          goalsLoading: false,
        goalCurrent: action.payload
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
    case CLEAR_GOALS_ERROR: 
      return {
        ...state, 
        goalsError: null
      }
    default: 
      return state;
  }
}