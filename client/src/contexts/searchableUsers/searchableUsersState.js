import React, { useReducer } from 'react';
import axios from 'axios';
import SearchableUsersContext from './searchableUsersContext';
import SearchableUsersReducer from './searchableUsersReducer';
import {
  GET_SEARCHABLE_USERS,
  FILTER_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_FILTER,
  SEARCHABLE_USERS_ERROR,
  CLEAR_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_ERRORS
} from '../types';

const SearchableUsersState = props => {
  const initialState = {
    searchableUsers: [],
    filteredUsers: [],
    error: null
  };

  const [state, dispatch] = useReducer(SearchableUsersReducer, initialState);

  //get searchable users
  const getSearchableUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      dispatch ({ type: GET_SEARCHABLE_USERS, payload: res.data });
    } catch (err) {
      dispatch({ type: SEARCHABLE_USERS_ERROR, payload: err.response.data.msg });
    }
  };

  //filter searchable users
  const filterSearchableUsers = async text => {
    dispatch({ type: FILTER_SEARCHABLE_USERS, payload: text });
  };

  //clear searchable users filter
  const clearSearchableUsersFilter = async () => {
    dispatch({ type: CLEAR_SEARCHABLE_USERS_FILTER });
  };

  //clear searchable users
  const clearSearchableUsers = async () => {
    dispatch({ type: CLEAR_SEARCHABLE_USERS });
  };

  //clear errors
  const clearSearchableUsersErrors = async () => {
    dispatch({ CLEAR_SEARCHABLE_USERS_ERRORS });
  };

  return (
    <SearchableUsersContext.Provider
      value={{
        searchableUsers: state.searchableUsers,
        filteredUsers: state.filteredUsers,
        error: state.error,
        getSearchableUsers,
        clearSearchableUsers,
        filterSearchableUsers,
        clearSearchableUsersFilter,
        clearSearchableUsersErrors
    }}>
      {props.children}
    </SearchableUsersContext.Provider>
  );
};


export default SearchableUsersState;