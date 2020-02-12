import React, { useReducer } from 'react';
import axios from 'axios';
import CompetitionContext from './competitionContext';
import CompetitionReducer from './competitionReducer';
import {
  GET_COMPETITION,
  GET_COMPETITION_GOALS,
  GET_COMPETITION_PARTICIPANTS,
  ADD_COMPETITION,
  DELETE_COMPETITION,
  UPDATE_COMPETITION,
  ADD_USER_TO_COMPETITION,
  REMOVE_USER_FROM_COMPETITION,
  KICK_USER_FROM_COMPETITION,
  ADD_ADMIN_TO_COMPETITION,
  REMOVE_ADMIN_FROM_COMPETITION,
  SET_COMPETITION_LOADING,
  CLEAR_COMPETITION,
  COMPETITION_ERROR
} from '../types';

const CompetitionState = props => {
  const initialState = {
    competition: {},
    competitionGoals: [],
    competitionParticipants: [],
    competitionError: null,
    competitionLoading: true
  };

  const [state, dispatch] = useReducer(CompetitionReducer, initialState);

  //set headers for addGoal, updateGoal, and updateGoalTracker
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get competition
  const getCompetition = async (_id) => {
    //console.log(''getCompetition')
    try {
      setLoading();
      const res = await axios.get(`/api/competitions/${_id}`);
      dispatch({ type: GET_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  //get competition goals for all participants
  const getCompetitionGoals = async (_id) => {
    //console.log(''getCompetitionGoals')
    try {
      setLoading();
      const res = await axios.get(`/api/competitions/goals/${_id}`);
      dispatch({ type: GET_COMPETITION_GOALS, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const getCompetitionParticipants = async (_id) => {
    //console.log(''getCompetitionParticipants')
    try {
      setLoading();
      const res = await axios.get(`/api/competitions/participants/${_id}`);
      dispatch({ type: GET_COMPETITION_PARTICIPANTS, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  }

  //add competition
  const addCompetition = async (_id, isMax) => {
    try {
      //console.log(''addCompetition')
      setLoading();
      const res = await axios.post(`/api/competitions/${_id}`, {isMax}, config);
      dispatch({ type: ADD_COMPETITION, payload: res.data});
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  //delete competition
  const deleteCompetition = async (_id) => {
    //console.log(''deleteCompetition')
    try {
      setLoading();
      await axios.delete(`/api/competitions/${_id}`);
      dispatch({ type: DELETE_COMPETITION });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  //update competition
  const updateCompetition = async (comp) => {
    //console.log(''updateCompetition')
    try{
      setLoading();
      const res = await axios.put(`/api/competitions/${comp._id}`, comp, config);
      dispatch({ type: UPDATE_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const addUserToCompetition = async (_id) => {
    //console.log(''addUserToCompetition')
    try{
      setLoading();
      const res = await axios.put(`/api/competitions/adduser/${_id}`);
      dispatch({ type: ADD_USER_TO_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const removeUserFromCompetition = async (_id) => {
    //console.log(''removeUserFromCompetition')
    try{
      setLoading();
      await axios.put(`/api/competitions/removeuser/${_id}`);
      dispatch({ type: REMOVE_USER_FROM_COMPETITION });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const kickUserFromCompetition = async (_id, kickeeId) => {
    //console.log(''kickFromCompetition')
    try{
      setLoading();
      const res = await axios.put(`/api/competitions/kickuser/${_id}`, {kickeeId}, config);
      dispatch({ type: KICK_USER_FROM_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const addAdminToCompetition = async (_id, newAdminId) => {
    //console.log(''addAdminToCompetition')
    try{
      setLoading();
      const res = await axios.put(`/api/competitions/addadmin/${_id}`, newAdminId, config);
      dispatch({ type: ADD_ADMIN_TO_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  const removeAdminFromCompetition = async (_id) => {
    //console.log(''removeAdminFromCompetition')
    try{
      setLoading();
      const res = await axios.put(`/api/competitions/removeadmin/${_id}`);
      dispatch({ type: REMOVE_ADMIN_FROM_COMPETITION, payload: res.data });
    } catch (err) {
      dispatch({ type: COMPETITION_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    //console.log(''setLoading')
    return { type: SET_COMPETITION_LOADING }
  };

  //clear requests
  const clearCompetition = () => {
    //console.log(''clearCompetition')
    dispatch({ type: CLEAR_COMPETITION });
  };

  return (
    <CompetitionContext.Provider
    value={{
      competition: state.competition,
      competitionGoals: state.competitionGoals,
      competitionParticipants: state.competitionParticipants,
      competitionError: state.competitionError,
      competitionLoading: state.competitionLoading,
      getCompetition,
      getCompetitionGoals,
      getCompetitionParticipants,
      addCompetition,
      deleteCompetition,
      updateCompetition,
      addUserToCompetition,
      removeUserFromCompetition,
      kickUserFromCompetition,
      addAdminToCompetition,
      removeAdminFromCompetition,
      clearCompetition
    }}>
      {props.children}
    </CompetitionContext.Provider>
  )
};

export default CompetitionState;