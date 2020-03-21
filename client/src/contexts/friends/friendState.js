import React, { useReducer } from 'react'
import axios from 'axios'
import FriendContext from './friendContext'
import FriendReducer from './friendReducer'
import {
  GET_FRIENDS,
  ADD_FRIEND,
  DELETE_FRIEND,
  SET_CURRENT_FRIEND,
  GET_CURRENT_FRIEND_GOALS,
  GET_CURRENT_FRIEND_FRIENDS,
  SET_CURRENT_FRIEND_GOAL,
  CLEAR_CURRENT_FRIEND,
  SET_FRIENDS_LOADING,
  FRIENDS_ERROR,
  CLEAR_FRIENDS,
  FILTER_FRIENDS,
  CLEAR_FRIENDS_FILTER
} from '../types'

const FriendState = props => {
  const initialState = {
    friends: [],
    friendIds: [],
    friendCurrent: {},
    friendsFiltered: null,
    friendsError: null,
    friendsLoading: true,
    friendCurrentGoals: [],
    friendCurrentFriends: [],
    friendCurrentGoal: {}
  }

  const [state, dispatch] = useReducer(FriendReducer, initialState)
  
  //get friends
  const getFriends = async () => {
    //console.log('getFriends')
    try {
      //setLoading()
      const res = await axios.get('/api/friends')
      dispatch({ type: GET_FRIENDS, payload: res.data })
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg })
    }
  }

  //add friend
  const addFriend = async userId => {
    //console.log('addFriend')
    try {
      //setLoading()
      const res = await axios.patch(`/api/friends/add/${userId}`)
      dispatch({ type: ADD_FRIEND, payload: res.data })
      getFriends()
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg })
    }
  }

  //delete friend
  const deleteFriend = async _id => {
    //console.log('deleteFriend')
    try {
      //setLoading()
      await axios.patch(`/api/friends/remove/${_id}`)
      dispatch({ type: DELETE_FRIEND, payload: _id })
      getFriends()
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg })
    }
  }

  //set current friend
  const setCurrentFriend = _id => {
    //console.log('setCurrentFriend')
    dispatch({ type: SET_CURRENT_FRIEND, payload: _id })
  }

  //get current friend goals
  const getCurrentFriendGoals = async (_id) => {
    //console.log('getCurrentFriendGoals')
    try {
      setLoading()
      const res = await axios.get(`/api/friends/goals/${_id}`)
      dispatch({ type: GET_CURRENT_FRIEND_GOALS, payload: res.data })
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg })
    }
  }

  //get current friend friends
  const getCurrentFriendFriends = async (_id) => {
    //console.log('getCurrentFriendFriends')
    try {
      setLoading()
      const res = await axios.get(`/api/friends/friends/${_id}`)
      dispatch({ type: GET_CURRENT_FRIEND_FRIENDS, payload: res.data })
    } catch (err) {
      dispatch({ type: FRIENDS_ERROR, payload: err.response.data.msg })
    }
  }

  //set current friend goal
  const setCurrentFriendGoal = (_id) => {
    //console.log('setCurrentFriendGoal')
    dispatch({ type: SET_CURRENT_FRIEND_GOAL, payload: _id })
  }

  //clear current friend
  const clearCurrentFriend = () => {
    //console.log('clearCurrentFriend')
    dispatch({ type: CLEAR_CURRENT_FRIEND })
  }

  //clear friends
  const clearFriends = () => {
    //console.log('clearFriends')
    dispatch({ type: CLEAR_FRIENDS })
  }

  //set loading
  const setLoading = () => {
    //console.log('setLoading')
    dispatch({ type: SET_FRIENDS_LOADING })
  }

  //filter friends
  const filterFriends = text => {
    //console.log('filterFriends')
    dispatch({ type: FILTER_FRIENDS, payload: text})
  }

  //clear filter
  const clearFriendsFilter = () => {
    //console.log('clearFriendsFilter')
    dispatch({ type: CLEAR_FRIENDS_FILTER })
  }

  return (
    <FriendContext.Provider
      value={{
        friends: state.friends,
        friendIds: state.friendIds,
        friendCurrent: state.friendCurrent,
        friendsFiltered: state.friendsFiltered,
        friendsError: state.friendsError,
        friendsLoading: state.friendsLoading,
        friendCurrentGoals: state.friendCurrentGoals,
        friendCurrentFriends: state.friendCurrentFriends,
        friendCurrentGoal: state.friendCurrentGoal,
        getFriends,
        addFriend,
        deleteFriend,
        setCurrentFriend,
        getCurrentFriendGoals,
        getCurrentFriendFriends,
        setCurrentFriendGoal,
        clearCurrentFriend,
        filterFriends,
        clearFriendsFilter,
        clearFriends
    }}>
      {props.children}
    </FriendContext.Provider>
  )
}

export default FriendState