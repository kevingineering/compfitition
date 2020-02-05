import React, { useReducer } from 'react';
import axios from 'axios';
import GoalContext from './goalContext';
import GoalReducer from './goalReducer';
import {
  GET_GOALS,
  ADD_GOAL,
  DELETE_GOAL,
  UPDATE_GOAL,
  UPDATE_GOAL_TRACKER,
  SET_CURRENT_GOAL,
  CLEAR_CURRENT_GOAL,
  //SET_GOAL_LOADING,
  GOAL_ERROR,
  CLEAR_GOALS
} from '../types';

const GoalState = props => {
  const initialState = {
    goals: [],
    goalCurrent: {},
    goalsError: null,
    goalsLoading: true
  };

  const [state, dispatch] = useReducer(GoalReducer, initialState);

  //set headers for addGoal, updateGoal, and updateGoalTracker
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get user goals
  const getGoals = async () => {
    try {
      //setLoading();
      const res = await axios.get('/api/goals');
      dispatch({ type: GET_GOALS, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //add goal
  const addGoal = async goal => {
    try {
      //setLoading();
      const res = await axios.post('/api/goals', goal, config);
      dispatch({ type: ADD_GOAL, payload: res.data});
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //delete goal
  const deleteGoal = async _id => {
    try {
      //setLoading();
      await axios.delete(`/api/goals/${_id}`);
      dispatch({ type: DELETE_GOAL, payload: _id });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //update goal
  const updateGoal = async goal => {
    try {
      //setLoading();
      const res = await axios.put(`/api/goals/${goal._id}`, goal, config);
      dispatch({ type: UPDATE_GOAL, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //update goal tracker
  const updateGoalTracker = async (tracker, _id) => {
    try {
      //setLoading();
      const res = await axios.put(`/api/goals/tracker/${_id}`, {tracker}, config);
      dispatch({ type: UPDATE_GOAL_TRACKER, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  }
  
  // //set loading
  // const setLoading = () => {
  //   dispatch ({ type: SET_GOAL_LOADING })
  // };

  //set current
  const setCurrentGoal = _id => {
    dispatch({ type: SET_CURRENT_GOAL, payload: _id });
  };

  //clear current
  const clearCurrentGoal = () => {
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
      goalCurrent: state.goalCurrent,
      goalsError: state.goalsError,
      goalsLoading: state.goalsLoading,
      getGoals,
      addGoal,
      deleteGoal,
      updateGoal,
      updateGoalTracker,
      setCurrentGoal,
      clearCurrentGoal,
      clearGoals
    }}>
      {props.children}
    </GoalContext.Provider>
  )
};

export default GoalState;