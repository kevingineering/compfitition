import React, { useReducer } from 'react';
import uuid from 'uuid';
import AlertContext from './alertContext';
import AlertReducer from './alertReducer';
import {
  SET_ALERT,
  CLEAR_ALERTS
} from '../types';

const AlertState = props => {
  const initialState = [];

  const [state, dispatch] = useReducer(AlertReducer, initialState);

  //set alert
  const setAlert = msg => {
    const id = uuid.v4();
    dispatch({ type: SET_ALERT, payload: {msg, id}});
  };

  //remove alert
  const clearAlerts = () => {
    dispatch({ type: CLEAR_ALERTS });
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
        clearAlerts
      }}
    >
      {props.children}
    </AlertContext.Provider>    
  );
};

export default AlertState;