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
        letters: action.payload,
        lettersLoading: false
      }
    case ADD_INVITE:
      return {
        ...state,
        letters: [...state.letters, action.payload],
        lettersLoading: false
      }
    case DELETE_INVITE:
      return {
        ...state,
        letters: state.letters.filter(letter => letter._id !== action.payload),
        lettersLoading: false
      }
    // case DELETE_INVITES:
    //   return {
    //     ...state,
    //     letters: state.letters.filter(letter => letter._id !== action.payload._id),
    //     lettersLoading: false
    //   }
    case INVITE_ERROR:
      return {
        ...state,
        lettersError: action.payload,
        lettersLoading: false
      }
    case CLEAR_INVITES:
      return {
        ...state, 
        letters: [],
        lettersError: null,
        lettersLoading: true
      }
    case SET_INVITES_LOADING:
      return {
        ...state,
        lettersLoading: true
      }
    default: 
      return state;
  }
}