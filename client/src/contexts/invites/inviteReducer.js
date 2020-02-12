import {
  GET_INVITES,
  ADD_INVITE,
  DELETE_INVITE,
  //DELETE_INVITES,
  INVITE_ERROR,
  CLEAR_INVITES,
  SET_INVITES_LOADING
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case GET_INVITES:
      return {
        ...state,
        invites: action.payload,
        invitesLoading: false
      }
    case ADD_INVITE:
      return {
        ...state,
        invites: [...state.invites, action.payload],
        invitesLoading: false
      }
    case DELETE_INVITE:
      return {
        ...state,
        invites: state.invites.filter(invite => invite._id !== action.payload),
        invitesLoading: false
      }
    // case DELETE_INVITES:
    //   return {
    //     ...state,
    //     invites: state.invites.filter(invite => invite._id !== action.payload._id),
    //     invitesLoading: false
    //   }
    case INVITE_ERROR:
      return {
        ...state,
        invitesError: action.payload,
        invitesLoading: false
      }
    case CLEAR_INVITES:
      return {
        ...state, 
        invites: [],
        invitesError: null,
        invitesLoading: true
      }
    case SET_INVITES_LOADING:
      return {
        ...state,
        invitesLoading: true
      }
    default: 
      return state;
  }
}