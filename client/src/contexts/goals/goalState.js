import React, { useReducer } from 'react';
import axios from 'axios';
import GoalContext from './goalContext';
import GoalReducer from './goalReducer';
import {
  GET_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
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
    goals: [],
    current: {},
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(GoalReducer, initialState);

  //used for addGoal and updateGoal
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get goals
  const getGoals = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/goals');
      dispatch({ type: GET_GOALS, payload: res.data});
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //TODO getPublicGoals

  //TODO getFriendsGoals

  //add goal
  const addGoal = async goal => {
    try {
      setLoading();
      const res = await axios.post('/api/goals', goal, config);
      dispatch({ type: ADD_GOAL, payload: res.data});
    } catch (err) {
      console.log(err);
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
      goals: state.goals,
      current: state.current,
      error: state.error,
      loading: state.loading,
      getGoals,
      addGoal,
      deleteGoal,
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