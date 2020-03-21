import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  GET_CURRENT_FRIEND_GOALS,
  GET_CURRENT_FRIEND_FRIENDS,
  SET_CURRENT_FRIEND_GOAL,
  CLEAR_CURRENT_FRIEND,
  SET_FRIENDS_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIENDS,
  FILTER_FRIENDS,
  CLEAR_FRIENDS_FILTER
} from '../types'

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
        friendIds: [...state.friendIds, action.payload.userId],
        friendsLoading: false
      }
    case DELETE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter(friend => friend._id !== action.payload),
        friendIds: state.friendIds.filter(friendId => friendId !== action.payload),
        friendsLoading: false
      }
    case SET_CURRENT_FRIEND:
      return {
        ...state,
        friendCurrent: state.friends.find(friend => friend._id === action.payload)
      }
    case GET_CURRENT_FRIEND_GOALS:
      return {
        ...state,
        friendCurrentGoals: action.payload,
        friendsLoading: false
      }
    case GET_CURRENT_FRIEND_FRIENDS:
      return {
        ...state, 
        friendCurrentFriends: action.payload,
        friendsLoading: false
      }
    case SET_CURRENT_FRIEND_GOAL:
      return {
        ...state,
        friendCurrentGoal: state.friendCurrentGoals.find(goal => goal._id === action.payload)
      }
    case CLEAR_CURRENT_FRIEND:
      return {
        ...state,
        friendCurrent: {},
        friendCurrentGoals: [],
        friendCurrentFriends: [],
        friendCurrentGoal: {}
      }
    case SET_FRIENDS_LOADING:
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
    case CLEAR_FRIENDS:
      return {
        ...state,
        friends: [],
        friendIds: [],
        friendCurrent: {},
        friendsError: null,
        friendsLoading: true,
        friendsFiltered: null,
        friendCurrentGoals: [],
        friendCurrentFriends: [],
        friendCurrentGoal: {}
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
          )
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