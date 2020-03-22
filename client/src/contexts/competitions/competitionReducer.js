import {
  GET_COMPETITION,
  GET_COMPETITION_GOALS,
  GET_COMPETITION_PARTICIPANTS,
  GET_COMPETITION_INVITEES,
  GET_COMPETITION_CURRENT_GOAL,
  ADD_COMPETITION,
  DELETE_COMPETITION,
  UPDATE_COMPETITION,
  ADD_USER_TO_COMPETITION,
  REMOVE_USER_FROM_COMPETITION,
  KICK_USER_FROM_COMPETITION,
  ADD_ADMIN_TO_COMPETITION,
  REMOVE_ADMIN_FROM_COMPETITION,
  SET_COMPETITION_LOADING,
  CLEAR_COMPETITION,
  COMPETITION_ERROR,
  CLEAR_COMPETITION_ERROR
} from '../types'

export default (state, action) => {
  switch(action.type) {
    case GET_COMPETITION:
    case ADD_COMPETITION:
    case UPDATE_COMPETITION:
    case KICK_USER_FROM_COMPETITION:
    case ADD_ADMIN_TO_COMPETITION:
    case REMOVE_ADMIN_FROM_COMPETITION:
      return {
        ...state,
        competition: action.payload,
        competitionLoading: false
      }
    case ADD_USER_TO_COMPETITION:
      return {
        ...state, 
        competition: action.payload.competition,
        competitionCurrentGoal: action.payload.goal,
        competitionLoading: false
      }
    case GET_COMPETITION_GOALS:
      return {
        ...state,
        competitionGoals: action.payload,
        competitionLoading: false
      }
    case GET_COMPETITION_PARTICIPANTS:
      return {
        ...state, 
        competitionParticipants: action.payload,
        competitionLoading: false
      }
    case GET_COMPETITION_INVITEES:
      return {
        ...state, 
        competitionInvitees: action.payload,
        competitionLoading: false
      }
    case GET_COMPETITION_CURRENT_GOAL:
      return {
        ...state,
        competitionCurrentGoal: action.payload
      }
    case COMPETITION_ERROR:
      return {
        ...state,
        competitionError: action.payload,
        competitionLoading: false
      }
    case DELETE_COMPETITION:
    case REMOVE_USER_FROM_COMPETITION:
    case CLEAR_COMPETITION:
      return {
        ...state, 
        competition: {},
        competitionGoals: [],
        competitionParticipants: [],
        competitionInvitees: [],
        competitionCurrentGoal: {},
        competitionError: null,
        competitionLoading: true
      }
    case SET_COMPETITION_LOADING:
      return {
        ...state,
        competitionLoading: true
      }
    case CLEAR_COMPETITION_ERROR:
      return {
        ...state,
        competitionError: null
      }
    default: 
      return state
  }
}