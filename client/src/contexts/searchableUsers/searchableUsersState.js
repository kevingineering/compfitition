import React, { useReducer } from 'react';
import axios from 'axios';
import SearchableUsersContext from './searchableUsersContext';
import SearchableUsersReducer from './searchableUsersReducer';
import {
  GET_SEARCHABLE_USERS,
  FILTER_SEARCHABLE_USERS,
  CLEAR_SEARCHABLE_USERS_FILTER,
  SEARCHABLE_USERS_ERROR,
  CLEAR_SEARCHABLE_USERS
} from '../types';

const SearchableUsersState = props => {
  const initialState = {
    searchableUsers: [],
    searchableUsersFiltered: null,
    searchableUsersError: null
  };

  const [state, dispatch] = useReducer(SearchableUsersReducer, initialState);

  //get searchable users
  const getSearchableUsers = async () => {
    //console.log('getSearchableUsers')
    try {
      const res = await axios.get('/api/auth/users');
      dispatch ({ type: GET_SEARCHABLE_USERS, payload: res.data });
    } catch (err) {
      dispatch({ type: SEARCHABLE_USERS_ERROR, payload: err.response.data.msg });
    }
  };

  //filter searchable users
  const filterSearchableUsers = async text => {
    //console.log('filterSearchableUsers')
    dispatch({ type: FILTER_SEARCHABLE_USERS, payload: text });
  };

  //clear searchable users filter
  const clearSearchableUsersFilter = async () => {
    //console.log('clearSearchableUsersFilter')
    dispatch({ type: CLEAR_SEARCHABLE_USERS_FILTER });
  };

  //clear searchable users
  const clearSearchableUsers = async () => {
    //console.log('clearSearchableUsers')
    dispatch({ type: CLEAR_SEARCHABLE_USERS });
  };

  return (
    <SearchableUsersContext.Provider
      value={{
        searchableUsers: state.searchableUsers,
        searchableUsersFiltered: state.searchableUsersFiltered,
        searchableUsersError: state.searchableUsersError,
        getSearchableUsers,
        clearSearchableUsers,
        filterSearchableUsers,
        clearSearchableUsersFilter
    }}>
      {props.children}
    </SearchableUsersContext.Provider>
  );
};


export default SearchableUsersState;