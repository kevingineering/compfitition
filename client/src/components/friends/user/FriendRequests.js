import React, { useContext, useEffect } from 'react';
import RequestContext from '../../../contexts/requests/requestContext';
import FriendRequest from './FriendRequest';

const FriendRequests = () => {

  console.log('FriendRequests')

  const requestContext = useContext(RequestContext);
  const { getRequests, requestsReceived } = requestContext;

  useEffect(() => {
    getRequests();
    //eslint-disable-next-line
  }, [])

  const requestList = requestsReceived.length === 0 ? null :
    requestsReceived.map(request => {
      return <FriendRequest key={request._id} request={request} />
    })

  return (
    <React.Fragment>
      {requestsReceived.length !== 0 &&
        <p className='lr-border'/>
      }
      {requestList}
    </React.Fragment>
  )
}

export default FriendRequests;