import React, { useContext, useEffect } from 'react';
import SearchableUsersContext from '../../contexts/searchableUsers/searchableUsersContext';

const SearchPage = () => {
  const searchableUsersContext = useContext(SearchableUsersContext);
  const { getSearchableUsers } = searchableUsersContext;

  useEffect(() => {
    getSearchableUsers();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      
    </div>
  )
}

export default SearchPage;