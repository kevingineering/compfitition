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
  SET_CURRENT_GOAL_BY_COMP,
  CLEAR_CURRENT_GOAL,
  //SET_GOAL_LOADING,
  GOAL_ERROR,
  CLEAR_GOALS,
  CLEAR_GOALS_ERROR
} from '../types';

const GoalState = props => {
  const initialState = {
    goals: [],
    goalCurrent: {},
    goalsError: null,
    goalsLoading: true
  };

  const [state, dispatch] = useReducer(GoalReducer, initialState);

  //set headers for requests with body
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get user goals
  const getGoals = async () => {
    //console.log('getGoals')
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
    //console.log('addGoal')
    try {
      //setLoading();
      const res = await axios.post('/api/goals', goal, config);
      dispatch({ type: ADD_GOAL, payload: res.data});
      setCurrentGoal(res.data._id);
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //delete goal
  const deleteGoal = async _id => {
    //console.log('deleteGoal')
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
    //console.log('updateGoal')
    try {
      //setLoading();
      const res = await axios.patch(`/api/goals/${goal._id}`, goal, config);
      dispatch({ type: UPDATE_GOAL, payload: res.data });
    } catch (err) {
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  };

  //update goal tracker
  const updateGoalTracker = async (tracker, _id) => {
    //console.log('updateGoalTracker')
    try {
      //setLoading();
      const res = await axios.patch(`/api/goals/tracker/${_id}`, {tracker}, config);
      dispatch({ type: UPDATE_GOAL_TRACKER, payload: res.data });
    } catch (err) {
      console.log(err)
      dispatch({ type: GOAL_ERROR, payload: err.response.data.msg });
    }
  }
  
  // //set loading
  // const setLoading = () => {
  //   dispatch ({ type: SET_GOAL_LOADING })
  // };

  //set current
  const setCurrentGoal = _id => {
    //console.log('setCurrentGoal')
    dispatch({ type: SET_CURRENT_GOAL, payload: _id });
  };

  const setCurrentGoalByComp = compId => {
    //console.log('setCurrentGoalByComp')
    dispatch({ type: SET_CURRENT_GOAL_BY_COMP, payload: compId })
  }

  //clear current
  const clearCurrentGoal = () => {
    //console.log('clearCurrentGoal')
    dispatch({ type: CLEAR_CURRENT_GOAL });
  };

  //clear goals
  const clearGoals = () => {
    //console.log('clearGoals')
    dispatch({ type: CLEAR_GOALS });
  };

  //clear goals error
  const clearGoalsError = () => {
    //console.log('clearGoalsError')
    dispatch({ type: CLEAR_GOALS_ERROR });
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
      setCurrentGoalByComp,
      clearCurrentGoal,
      clearGoals,
      clearGoalsError
    }}>
      {props.children}
    </GoalContext.Provider>
  )
};

export default GoalState;