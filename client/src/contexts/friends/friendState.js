import React from 'react';
import axios from 'axios';
import FriendContext from './friendContext';
import FriendReducer from './friendReducer';
import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  CLEAR_CURRENT_FRIEND,
  SET_FRIENDS_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIEND_ERRORS,
  CLEAR_FRIENDS,
} from '../types';

const FriendState = props => {
  const initialState = {
    friends: [],
    current: {},
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(FriendReducer, initialState);

  //used for addGoal and updateGoal
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get friends
  const getFriends = async () => {

  }

  //add friend
  const addFriend = async () => {

  }

  //delete friend
  const deleteFriend = async () => {

  }

  //set current friend
  const setCurrentFriend = async () => {

  }

  //clear current friend
  const clearCurrentFriend = async () => {

  }

  //reject friend
  const clearFriends = async () => {

  }

  //set loading
  const setLoading = async () => {

  }

  //clear error
  const clearFriendErrors = async () => {

  }

  return (
    <FriendContext.Provider
      value={{
        friends: state.friends,
        current: state.current,
        error: state.error,
        loading: state.loading,
        getFriends,
        addFriend,
        deleteFriend,
        setCurrentFriend,
        clearCurrentFriend,
        clearFriends,
        clearFriendErrors
    }}>
      {props.children}
    </FriendContext.Provider>
  );
};

export default FriendState;