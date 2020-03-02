import React, { useContext, useEffect } from 'react';
import SearchableUsersContext from '../../contexts/searchableUsers/searchableUsersContext';
import SearchResults from './SearchResults';
import SearchBar from './SearchBar';

const SearchPage = () => {
  const searchableUsersContext = useContext(SearchableUsersContext);
  const { 
    getSearchableUsers, 
    filterSearchableUsers, 
    clearSearchableUsers, 
    clearSearchableUsersFilter
  } = searchableUsersContext;

  //get users and clear everything when navigating away from page
  useEffect(() => {
    getSearchableUsers();
    return () => {
      clearSearchableUsers();
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className='form-container'>
      <SearchBar 
        filter={filterSearchableUsers} 
        clear={clearSearchableUsersFilter}
      />
      <ul className='collection'>
        <li className='collection-header'>
          <h2>Search Results</h2>
        </li>
        <p className='lr-border'/>
        <SearchResults/>
      </ul>
    </div>
  );
};

export default SearchPage;