import React, { useReducer } from 'react';
import axios from 'axios';
import LetterContext from './letterContext';
import LetterReducer from './letterReducer';
import {
  GET_LETTERS,
  ADD_LETTER,
  DELETE_LETTER,
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

  //set headers for requests with body
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  //get user or comp letters
  const getLetters = async (compId = '') => {
    //console.log('getLetters')
    //fields should include type, compId, compName, and userId
    //fields can include userName and/or startDate
    try {
      setLoading();
      const res = await axios.get('/api/letters/' + compId);
      dispatch({ type: GET_LETTERS, payload: res.data });
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };

  //add letter
  const addLetter = async (fields) => {
    //console.log('addLetter')
    try {
      setLoading();
      const res = await axios.post('/api/letters', fields, config);
      dispatch({ type: ADD_LETTER, payload: res.data});
    } catch (err) {
      dispatch({ type: LETTER_ERROR, payload: err.response.data.msg });
    }
  };
  
  //delete letter
  const deleteLetter = async letterId => {
    //console.log('deleteLetter')
    try {
      setLoading();
      const res = await axios.delete(`/api/letters/${letterId}`);
      dispatch({ type: DELETE_LETTER, payload: res.data });
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
      clearLetters
    }}>
      {props.children}
    </LetterContext.Provider>
  )
};

export default LetterState;