import {
  GET_REQUESTS,
  ADD_REQUEST,
  DELETE_REQUEST,
  REQUEST_ERROR,
  CLEAR_REQUESTS,
  SET_REQUESTS_LOADING
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload.requests,
        requestsSent: action.payload.requests.filter(request => request.requester === action.payload.userId),
        requestsReceived: action.payload.requests.filter(request => request.requestee === action.payload.userId),
        requestsLoading: false
      }
    case ADD_REQUEST:
      return {
        ...state,
        requests: [...state.requests, action.payload],
        requestsSent: [...state.requestsSent, action.payload],
        requestsLoading: false
      }
    case DELETE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(request => request._id !== action.payload),
        requestsSent: state.requestsSent.filter(request => request._id !== action.payload),
        requestsReceived: state.requestsReceived.filter(request => request._id !== action.payload),
        requestsLoading: false
      }
    case REQUEST_ERROR:
      return {
        ...state,
        requestsError: action.payload,
        requestsLoading: false
      }
    case CLEAR_REQUESTS:
      return {
        ...state, 
        requests: [],
        requestsSent: [],
        requestsReceived: [],
        requestsError: null,
        requestsLoading: true
      }
    case SET_REQUESTS_LOADING:
      return {
        ...state,
        requestsLoading: true
      }
    default: 
      return state;
  }
}