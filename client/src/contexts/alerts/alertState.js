import React, { useReducer } from 'react';
import uuid from 'uuid';
import AlertContext from './alertContext';
import AlertReducer from './alertReducer';
import {
  SET_ALERT,
  REMOVE_ALERT,
  CLEAR_ALERT
} from '../types';

const AlertState = props => {
  const initialState = {};

  const [state, dispatch] = useReducer(AlertReducer, initialState);

  //set alert - will timeout after 3 seconds
  //if type is true, clear alert will not clear it
  const setAlert = (msg, persist = false) => {
    //console.log('setAlert');
    const alertId = uuid.v4();
    dispatch({ type: SET_ALERT, payload: {msg, alertId, persist}});

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: alertId }), 3000);
  };

  //clear alert
  const clearAlert = () => {
    //console.log('clearAlert');
    dispatch({ type: CLEAR_ALERT });
  };

  return (
    <AlertContext.Provider
      value={{
        alert: state,
        setAlert,
        clearAlert
      }}
    >
      {props.children}
    </AlertContext.Provider>    
  );
};

export default AlertState;