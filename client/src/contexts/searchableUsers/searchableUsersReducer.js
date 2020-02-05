import {
  GET_SEARCHABLE_USERS,
  FILTER_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_FILTER,
  SEARCHABLE_USERS_ERROR,
  CLEAR_SEARCHABLE_USERS
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
        searchableUsers: [],
        searchableUsersFiltered: null,
        searchableUsersError: null
      }
    case FILTER_SEARCHABLE_USERS:
      return {
        ...state, 
        searchableUsersFiltered: state.searchableUsers.filter(user => {
          //Regular expression (regex) is used for searching text, 'gi' makes it not case sensitive
          const regex = new RegExp(`${action.payload}`, 'gi')
          return (
            user.firstName.match(regex) ||
            user.lastName.match(regex) ||
            user.email.match(regex)
          );
        })
      }
    case CLEAR_SEARCHABLE_USERS_FILTER:
      return {
        ...state, 
        searchableUsersFiltered: null
      }
    case SEARCHABLE_USERS_ERROR:
      return {
        ...state, 
        searchableUsersError: action.payload
      }
    default: 
      return state;
  };
};