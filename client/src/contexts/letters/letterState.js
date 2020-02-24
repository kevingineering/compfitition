import React, { useReducer } from 'react';
import axios from 'axios';
import letterContext from './letterContext';
import LetterReducer from './letterReducer';
import {
  GET_INVITES,
  ADD_INVITE,
  DELETE_INVITE,
  DELETE_INVITES,
  INVITE_ERROR,
  CLEAR_INVITES,
  SET_INVITES_LOADING
} from '../types';

const LetterState = props => {
  const initialState = {
    letters: [],
    lettersError: null,
    lettersLoading: true
  };

  const [state, dispatch] = useReducer(LetterReducer, initialState);

  //get user letters
  const getLetters = async () => {
    //console.log('getLetters')
    try {
      setLoading();
      const res = await axios.get('/api/letters');
      dispatch({ type: GET_INVITES, payload: { letters: res.data.letters, id: res.data.id }});
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //add letter
  const addLetter = async letter => {
    //console.log('addLetter')
    try {
      setLoading();
      const res = await axios.post('/api/letters');
      dispatch({ type: ADD_INVITE, payload: res.data});
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };
  
  //delete letter
  const deleteLetter = async _id => {
    //console.log('deleteLetter')
    try {
      setLoading();
      const res = await axios.delete(`/api/letters/${_id}`);
      dispatch({ type: DELETE_INVITE, payload: res.data });
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //delete all letters associated with a competition
  const deleteLetters = async _id => {
    //console.log('deleteLetters')
    try {
      setLoading();
      const res = await axios.delete(`/api/letters/${_id}`);
      dispatch({ type: DELETE_INVITES, payload: res.data });
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    //console.log('setLoading')
    return { type: SET_INVITES_LOADING }
  };

  //clear letters
  const clearLetters = () => {
    //console.log('clearLetters')
    dispatch({ type: CLEAR_INVITES });
  };

  return (
    <letterContext.Provider
    value={{
      letters: state.letters,
      lettersError: state.lettersError,
      lettersLoading: state.lettersLoading,
      getLetters,
      addLetter,
      deleteLetter,
      deleteLetters,
      clearLetters
    }}>
      {props.children}
    </letterContext.Provider>
  )
};

export default LetterState;