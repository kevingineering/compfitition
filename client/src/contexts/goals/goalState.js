import React, { useReducer } from 'react';
import axios from 'axios';
import GoalContext from './goalContext';
import GoalReducer from './goalReducer';
import {
  GET_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  UPDATE_GOAL,
  SET_CURRENT,
  CLEAR_CURRENT,
  SET_LOADING,
  GOAL_ERROR,
  CLEAR_ERRORS
} from '../types';

const GoalState = props => {
  const initialState = {
    goals: null,
    current: null,
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

  //get goals
  const getGoals = async () => {
    try {
      setLoading();
      const res = await axios.get('/goals');
      dispatch({ type: GET_GOALS, payload: res.data});
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err });
    }
  };

  //add goal
  const addGoal = async goal => {
    try {
      setLoading();
      const res = await axios.post('/goals', goal, config);
      dispatch({ type: ADD_GOAL, payload: res.data});
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err });
    }
  };

  //delete goal
  const deleteGoal = async id => {
    try {
      setLoading();
      await axios.delete(`/goals/${id}`);
      dispatch({ type: DELETE_GOAL, payload: id });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err });
    }
  };

  //update goal
  const updateGoal = async goal => {
    try {
      setLoading();
      const res = await axios.put(`/goals/${goal.id}`, goal, config);
      dispatch({ type: UPDATE_GOAL, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err });
    }
  };

  //set loading
  const setLoading = () => {
    return {type: SET_LOADING}
  };

  //clear errors
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  //set current
  const setCurrent = goal => {
    dispatch({ type: SET_CURRENT });
  };

  //clear current
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
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
      setCurrent,
      clearCurrent,
      updateGoal,
      clearErrors
    }}>
      {props.children}
    </GoalContext.Provider>
  )
};

export default GoalState;