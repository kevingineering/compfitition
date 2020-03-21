import {
  GET_LETTERS,
  ADD_LETTER,
  DELETE_LETTER,
  LETTER_ERROR,
  CLEAR_LETTERS,
  SET_LETTERS_LOADING
} from '../types'

export default (state, action) => {
  switch(action.type) {
    case GET_LETTERS:
      return {
        ...state,
        letters: action.payload,
        lettersLoading: false
      }
    case ADD_LETTER:
      return {
        ...state,
        letters: [...state.letters, action.payload.letter],
        lettersError: action.payload.msg,
        lettersLoading: false
      }
    case DELETE_LETTER:
      return {
        ...state,
        letters: state.letters.filter(letter => letter._id !== action.payload.letterId),
        lettersLoading: false
      }
    case LETTER_ERROR:
      return {
        ...state,
        lettersError: action.payload,
        lettersLoading: false
      }
    case CLEAR_LETTERS:
      return {
        ...state, 
        letters: [],
        lettersError: null,
        lettersLoading: true
      }
    case SET_LETTERS_LOADING:
      return {
        ...state,
        lettersLoading: true
      }
    default: 
      return state
  }
}