import {
  GET_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  UPDATE_GOAL,
  SET_CURRENT,
  CLEAR_CURRENT,
  SET_LOADING,
  GOAL_ERROR,
  CLEAR_ERRORS
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
        goals: state.goals.filter(goal => goal.id !== action.payload),
        loading: false
      }
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal),
        loading: false
      }
    case SET_LOADING:
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
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      }
    default: 
      return state;
  }
}