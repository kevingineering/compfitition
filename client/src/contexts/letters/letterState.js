import React, { useReducer } from 'react';
import axios from 'axios';
import LetterContext from './letterContext';
import LetterReducer from './letterReducer';
import {
  GET_LETTERS,
  ADD_LETTER,
  DELETE_LETTER,
  DELETE_LETTERS,
  LETTER_ERROR,
  CLEAR_LETTERS,
  SET_LETTERS_LOADING
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
      dispatch({ type: GET_LETTERS, payload: res.data });
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };

  //add letter
  const addLetter = async letter => {
    //console.log('addLetter')
    try {
      setLoading();
      const res = await axios.post('/api/letters');
      dispatch({ type: ADD_LETTER, payload: res.data});
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };
  
  //delete letter
  const deleteLetter = async _id => {
    //console.log('deleteLetter')
    try {
      setLoading();
      const res = await axios.delete(`/api/letters/${_id}`);
      dispatch({ type: DELETE_LETTER, payload: res.data });
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };

  //delete all letters associated with a competition
  const deleteLetters = async _id => {
    //console.log('deleteLetters')
    try {
      setLoading();
      const res = await axios.delete(`/api/letters/${_id}`);
      dispatch({ type: DELETE_LETTERS, payload: res.data });
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    //console.log('setLoading')
    return { type: SET_LETTERS_LOADING }
  };

  //clear letters
  const clearLetters = () => {
    //console.log('clearLetters')
    dispatch({ type: CLEAR_LETTERS });
  };

  return (
    <LetterContext.Provider
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
    </LetterContext.Provider>
  )
};

export default LetterState;