import {
  GET_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  UPDATE_GOAL,
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
        loading: false
      }
    case ADD_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload],
        loading: false
      }
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        loading: false
      }
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(goal => 
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
        current: state.goals.find(goal => goal._id === action.payload)
      }
    case CLEAR_CURRENT_GOAL:
      return {
        ...state,
        current: {}
      }
    case CLEAR_GOALS:
      return { 
        ...state,
        goals: [],
        current: {},
        error: null,
        loading: true
      }
    default: 
      return state;
  }
}