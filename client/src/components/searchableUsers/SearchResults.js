import React, { useContext, useEffect } from 'react';
import SearchItem from './SearchItem';
import SearchableUsersContext from '../../contexts/searchableUsers/searchableUsersContext';
import FriendContext from '../../contexts/friends/friendContext';
import RequestContext from '../../contexts/requests/requestContext';

const SearchResults = () => {
  const searchableUsersContext = useContext(SearchableUsersContext);
  const { searchableUsers, searchableUsersFiltered } = searchableUsersContext;

  const friendContext = useContext(FriendContext);
  const { friendIds } = friendContext;

  const requestContext = useContext(RequestContext);
  const { requestsSent, requestsReceived, getRequests } = requestContext;

  const sentArray = requestsSent.map(request => {
    return request.requestee;
  })
  const receivedArray = requestsReceived.map(request => {
    return request.requester;
  })

  //configure results and send friend status down to child
  /*status can be
    friend          you are friends with this user
    stranger        you are not friends with this user
    received        they requested to be friends with you
    sent            you requested to be friends with them  
  */
 
  useEffect(() => {
    getRequests();
    //eslint-disable-next-line
  }, []);

  let searchList = 'Loading...';

  if (searchableUsers.length === 0)
    searchList = <li className='collection-item'>Loading...</li>;
  if (searchableUsersFiltered !== null) {
    searchList = searchableUsersFiltered.map(user => {
      let status = 'stranger';
      if (friendIds.includes(user._id)) {
        status = 'friend';
      } else if (receivedArray.includes(user._id)) {
        status = 'received';
      } else if (sentArray.includes(user._id)) {
        status = 'sent';
      }
      return <SearchItem key={user._id} user={user} status={status} />
    })
  }
  else {
    searchList = searchableUsers.map(user => {
      let status = 'stranger';
      if (friendIds.includes(user._id)) {
        status = 'friend';
      } else if (receivedArray.includes(user._id)) {
        status = 'received';
      } else if (sentArray.includes(user._id)) {
        status = 'sent';
      }
      return <SearchItem key={user._id} user={user} status={status} />
    })
  }
  return (
    <React.Fragment>
      <p className='lr-border'/>
      {searchList}
    </React.Fragment>
  );
}

export default SearchResults;