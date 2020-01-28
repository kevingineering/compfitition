import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  CLEAR_CURRENT_FRIEND,
  SET_FRIENDS_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIEND_ERRORS,
  CLEAR_FRIENDS,
} from '../types';

// friends: [],
// current: {},
// error: null,
// loading: true

export default (state, action) => {
  switch(action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
        loading: false
      }
    case ADD_FRIEND:
    case DELETE_FRIEND:
    case SET_CURRENT_FRIEND:
    case CLEAR_CURRENT_FRIEND:
    case SET_FRIENDS_LOADING:
    case FRIENDS_ERROR:
    case CLEAR_FRIEND_ERRORS:
    case CLEAR_FRIENDS:
    default: 
      return state
  }
}