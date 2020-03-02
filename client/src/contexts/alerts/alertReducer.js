import {
  SET_ALERT,
  REMOVE_ALERT,
  CLEAR_ALERT
} from '../types';

export default (state, action) => {
  switch(action.type) {
    case SET_ALERT:
      return action.payload;
    case REMOVE_ALERT:
      if (state.alertId === action.payload)
        return {};
      else return state;
    case CLEAR_ALERT:
      if (!state.persist)
        return {};
      else return state;
    default: 
      return state;
  };
};