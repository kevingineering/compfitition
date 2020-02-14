import React, { useReducer } from 'react';
import axios from 'axios';
import RequestContext from './requestContext';
import RequestReducer from './requestReducer';
import {
  GET_REQUESTS,
  ADD_REQUEST,
  DELETE_REQUEST,
  REQUEST_ERROR,
  CLEAR_REQUESTS,
  SET_REQUESTS_LOADING
} from '../types';

const RequestState = props => {
  const initialState = {
    requests: [],
    requestsSent: [],
    requestsReceived: [],
    requestsError: null,
    requestsLoading: true
  };

  const [state, dispatch] = useReducer(RequestReducer, initialState);

  //get user requests
  const getRequests = async () => {
    //console.log('getRequests')
    try {
      setLoading();
      const res = await axios.get('/api/requests');
      dispatch({ type: GET_REQUESTS, payload: { requests: res.data.requests, id: res.data.id }});
    } catch (err) {
      dispatch({ type: REQUEST_ERROR, payload: err.response.data.msg });
    }
  };

  //add request
  const addRequest = async _id => {
    //console.log('addRequest')
    try {
      setLoading();
      const res = await axios.post(`/api/requests/${_id}`);
      dispatch({ type: ADD_REQUEST, payload: res.data});
    } catch (err) {
      dispatch({ type: REQUEST_ERROR, payload: err.response.data.msg });
    }
  };
  
  //delete request - takes place after delete request you sent, accept request other sent, or reject request other sent 
  const deleteRequest = async _id => {
    //console.log('deleteRequest')
    try {
      setLoading();
      const res = await axios.delete(`/api/requests/${_id}`);
      dispatch({ type: DELETE_REQUEST, payload: res.data });
    } catch (err) {
      dispatch({ type: REQUEST_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    //console.log('setLoading')
    return { type: SET_REQUESTS_LOADING }
  };

  //clear requests
  const clearRequests = () => {
    //console.log('clearRequests')
    dispatch({ type: CLEAR_REQUESTS });
  };

  return (
    <RequestContext.Provider
    value={{
      requests: state.requests,
      requestsSent: state.requestsSent,
      requestsReceived: state.requestsReceived,
      requestsError: state.requestsError,
      requestsLoading: state.requestsLoading,
      getRequests,
      addRequest,
      deleteRequest,
      clearRequests
    }}>
      {props.children}
    </RequestContext.Provider>
  )
};

export default RequestState;