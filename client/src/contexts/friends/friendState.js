import React, { useReducer } from 'react';
import axios from 'axios';
import FriendContext from './friendContext';
import FriendReducer from './friendReducer';
import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  CLEAR_CURRENT_FRIEND,
  SET_FRIEND_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIEND_ERRORS,
  CLEAR_FRIENDS,
  FILTER_FRIENDS,
  CLEAR_FRIENDS_FILTER
} from '../types';

const FriendState = props => {
  const initialState = {
    friends: [],
    friendIds: [],
    friendCurrent: {},
    friendsFiltered: null,
    friendError: null,
    friendLoading: true,
    friendCurrentGoals: [],
    friendCurrentFriends: []
  };

  const [state, dispatch] = useReducer(FriendReducer, initialState);

  //get friends
  const getFriends = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/friends');
      dispatch({ type: GET_FRIENDS, payload: res.data });
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg });
    }
  };

  //add friend
  const addFriend = async _id => {
    try {
      setLoading();
      const res = await axios.put(`/api/friends/add/${_id}`);
      dispatch({ type: ADD_FRIEND, payload: res.data });
      getFriends();
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg });
    }
  };

  //delete friend AXIOS TODO
  const deleteFriend = async _id => {
    try {
      setLoading();
      await axios.put(`/api/friends/remove/${_id}`);
      dispatch({ type: DELETE_FRIEND, payload: _id });
      getFriends();
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg });
    }
  };

  //set current friend
  const setCurrentFriend = _id => {
    dispatch({ type: SET_CURRENT_FRIEND, payload: _id });
  };

  //get current friend goals
  const getCurrentFriendGoals = _id => {

  }

  //get current friend friends
  const getCurrentFriendFriends = _id => {
    
  }

  //clear current friend
  const clearCurrentFriend = () => {
    dispatch({ type: CLEAR_CURRENT_FRIEND });
  };

  //clear friends
  const clearFriends = () => {
    dispatch({ type: CLEAR_FRIENDS });
  };

  //set loading
  const setLoading = () => {
    dispatch({ type: SET_FRIEND_LOADING });
  };

  //clear error
  const clearFriendErrors = () => {
    dispatch({ type: CLEAR_FRIEND_ERRORS });
  };

  //filter friends
  const filterFriends = text => {
    dispatch({ type: FILTER_FRIENDS, payload: text});
  };

  //clear filter
  const clearFriendsFilter = () => {
    dispatch({ type: CLEAR_FRIENDS_FILTER });
  }

  return (
    <FriendContext.Provider
      value={{
        friends: state.friends,
        friendIds: state.friendIds,
        friendCurrent: state.friendCurrent,
        friendsFiltered: state.friendsFiltered,
        friendError: state.friendError,
        friendLoading: state.friendLoading,
        getFriends,
        addFriend,
        deleteFriend,
        setCurrentFriend,
        getCurrentFriendGoals,
        getCurrentFriendFriends,
        clearCurrentFriend,
        filterFriends,
        clearFriendsFilter,
        clearFriends,
        clearFriendErrors
    }}>
      {props.children}
    </FriendContext.Provider>
  );
};

export default FriendState;