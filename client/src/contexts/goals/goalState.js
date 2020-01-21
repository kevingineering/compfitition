import React, { useReducer } from 'react';
import axios from 'axios';
import GoalContext from './goalContext';
import GoalReducer from './goalReducer';
import {
  GET_USER_GOALS,
  GET_PUBLIC_GOALS,
  GET_FRIEND_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  DELETE_GOALS,
  UPDATE_GOAL,
  SET_CURRENT_GOAL,
  CLEAR_CURRENT_GOAL,
  SET_GOAL_LOADING,
  GOAL_ERROR,
  CLEAR_GOAL_ERRORS,
  CLEAR_GOALS
} from '../types';

const GoalState = props => {
  const initialState = {
    userGoals: [],
    publicGoals: [],
    friendGoals: [],
    current: {},
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(GoalReducer, initialState);

  //used for addGoal and updateGoal
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get user goals
  const getUserGoals = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/goals');
      dispatch({ type: GET_USER_GOALS, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //TODO get public goals
  const getPublicGoals = async () => {
    
  };

  //TODO get friend goals
  const getFriendGoals = async () => {

  };

  //add goal
  const addGoal = async goal => {
    try {
      setLoading();
      const res = await axios.post('/api/goals', goal, config);
      dispatch({ type: ADD_GOAL, payload: res.data});
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //delete goal
  const deleteGoal = async _id => {
    try {
      setLoading();
      await axios.delete(`/api/goals/${_id}`);
      dispatch({ type: DELETE_GOAL, payload: _id });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //delete goals
  const deleteGoals = async _id => {
    try {
      setLoading();
      await axios.delete(`/api/goals/user/${_id}`);
      dispatch({ type: DELETE_GOALS, payload: _id });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  }

  //update goal
  const updateGoal = async goal => {
    try {
      setLoading();
      const res = await axios.put(`/api/goals/${goal._id}`, goal, config);
      dispatch({ type: UPDATE_GOAL, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    return { type: SET_GOAL_LOADING }
  };

  //clear errors
  const clearGoalErrors = () => {
    dispatch({ type: CLEAR_GOAL_ERRORS });
  };

  //set current
  const setCurrent = _id => {
    dispatch({ type: SET_CURRENT_GOAL, payload: _id });
  };

  //clear current
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT_GOAL });
  };

  //clear goals
  const clearGoals = () => {
    dispatch({ type: CLEAR_GOALS });
  };

  return (
    <GoalContext.Provider
    value={{
      userGoals: state.userGoals,
      publicGoals: state.publicGoals,
      friendGoals: state.friendGoals,
      current: state.current,
      error: state.error,
      loading: state.loading,
      getUserGoals,
      getPublicGoals,
      getFriendGoals,
      addGoal,
      deleteGoal,
      deleteGoals,
      updateGoal,
      clearGoalErrors,
      setCurrent,
      clearCurrent,
      clearGoals
    }}>
      {props.children}
    </GoalContext.Provider>
  )
};

export default GoalState;