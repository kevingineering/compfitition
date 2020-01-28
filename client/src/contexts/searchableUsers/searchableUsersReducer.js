import {
  GET_SEARCHABLE_USERS,
  FILTER_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_FILTER,
  SEARCHABLE_USERS_ERROR,
  CLEAR_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_ERRORS
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case GET_SEARCHABLE_USERS:
      return {
        ...state, 
        searchableUsers: action.payload
      }
    case CLEAR_SEARCHABLE_USERS:
      return {
        ...state, 
        searchableUsers: []
      }
    case FILTER_SEARCHABLE_USERS:
      return {
        ...state, 
        filteredUsers: state.searchableUsers.filter(user => {
          //Regular expression (regex) is used for searching text, 'gi' makes it not case sensitive
          const regex = new RegExp(`${action.payload}`, 'gi')
          return (
            user.firstName.match(regex) ||
            user.lastName.match(regex) ||
            user.email.match(regex) ||
            user.alias.match(regex)
          );
        })
      }
    case CLEAR_SEARCHABLE_USERS_FILTER:
      return {
        ...state, 
        filteredUsers: []
      }
    case SEARCHABLE_USERS_ERROR:
      return {
        ...state, 
        error: action.payload
      }
    case CLEAR_SEARCHABLE_USERS_ERRORS:
      return {
        ...state, 
        error: null
      }
    default: 
      return state;
  };
};