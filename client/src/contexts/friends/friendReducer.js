import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  CLEAR_CURRENT_FRIEND,
  SET_FRIEND_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIEND_ERRORS,
  CLEAR_FRIENDS,
  FILTER_FRIENDS,
  CLEAR_FRIENDS_FILTER
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
        friendIds: action.payload.map(friend => friend._id),
        friendsLoading: false
      }
    case ADD_FRIEND:
      return {
        ...state,
        friends: [...state.friends, action.payload],
        friendIds: [...state.friendIds, action.payload.id],
        friendsLoading: false
      }
    case DELETE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter(friend => friend._id !== action.payload),
        friendIds: state.friendIds.filter(id => id !== action.payload),
        friendsLoading: false
      }
    case SET_CURRENT_FRIEND:
      return {
        ...state,
        friendCurrent: state.friends.find(friend => friend._id === action.payload)
      }
    case CLEAR_CURRENT_FRIEND:
      return {
        ...state,
        friendCurrent: {}
      }
    case SET_FRIEND_LOADING:
      return {
        ...state,
        friendsLoading: true
      }
    case FRIENDS_ERROR:
      return {
        ...state,
        friendsError: action.payload,
        friendsLoading: false
      }
    case CLEAR_FRIEND_ERRORS:
      return {
        ...state,
        friendsError: null
      }
    case CLEAR_FRIENDS:
      return {
        ...state,
        friends: [],
        friendsIds: [],
        friendCurrent: {},
        friendsError: null,
        friendsLoading: true
      }
    case FILTER_FRIENDS:
      return {
        ...state,
        friendsFiltered: state.friends.filter(friend => {
          //Regular expression (regex) is used for searching text, 'gi' makes it not case sensitive
          const regex = new RegExp(`${action.payload}`, 'gi')
          return (
            friend.firstName.match(regex) ||
            friend.lastName.match(regex) ||
            friend.email.match(regex) || 
            friend.alias.match(regex)
          );
        })
      }
    case CLEAR_FRIENDS_FILTER:
      return {
        ...state,
        friendsFiltered: null
      }
    default: 
      return state
  }
}