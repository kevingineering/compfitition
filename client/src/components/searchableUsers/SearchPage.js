import React, { useContext, useRef, useEffect } from 'react';
import SearchableUsersContext from '../../contexts/searchableUsers/searchableUsersContext';
import SearchResults from './SearchResults';

const SearchPage = () => {
  const searchableUsersContext = useContext(SearchableUsersContext);
  const { 
    getSearchableUsers, 
    filterSearchableUsers, 
    clearSearchableUsers, 
    clearSearchableUsersFilter
  } = searchableUsersContext;

  //useState is async, so we use useRef which is sync
  const text = useRef('');

  //get users and clear everything when navigating away from page
  useEffect(() => {
    getSearchableUsers();
    return () => {
      clearSearchableUsers();
    }
    //eslint-disable-next-line
  }, []);

  const handleChange = e => {
    if (text.current.value)
      filterSearchableUsers(e.target.value);
    else
      clearSearchableUsersFilter();
  };

  return (
    <div className='form-container'>
      <form>
        <input 
          type='text'
          ref={text}
          placeholder='Search Users'
          onChange={handleChange}
        />
      </form>
      <ul className='collection'>
        <li className='collection-header'>
          <h2>Search Results</h2>
        </li>
        <SearchResults/>
      </ul>
    </div>
  );
};

export default SearchPage;