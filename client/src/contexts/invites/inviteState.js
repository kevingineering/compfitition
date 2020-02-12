import React, { useReducer } from 'react';
import axios from 'axios';
import InviteContext from './inviteContext';
import InviteReducer from './inviteReducer';
import {
  GET_INVITES,
  ADD_INVITE,
  DELETE_INVITE,
  DELETE_INVITES,
  INVITE_ERROR,
  CLEAR_INVITES,
  SET_INVITES_LOADING
} from '../types';

const InviteState = props => {
  const initialState = {
    invites: [],
    invitesError: null,
    invitesLoading: true
  };

  const [state, dispatch] = useReducer(InviteReducer, initialState);

  //get user invites
  const getInvites = async () => {
    //console.log(''getInvites')
    try {
      setLoading();
      // const res = await axios.get('/api/invites');
      // dispatch({ type: GET_INVITES, payload: { invites: res.data.invites, id: res.data.id }});
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //add invite
  const addInvite = async invite => {
    //console.log(''addInvite')
    try {
      setLoading();
      // const res = await axios.post('/api/invites');
      // dispatch({ type: ADD_INVITE, payload: res.data});
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };
  
  //delete invite
  const deleteInvite = async _id => {
    //console.log(''deleteInvite')
    try {
      setLoading();
      // const res = await axios.delete(`/api/invites/${_id}`);
      // dispatch({ type: DELETE_INVITE, payload: res.data });
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //delete all invites associated with a competition
  const deleteInvites = async _id => {
    //console.log(''deleteInvites')
    try {
      setLoading();
      // const res = await axios.delete(`/api/invites/${_id}`);
      // dispatch({ type: DELETE_INVITE, payload: res.data });
    } catch (err) {
      dispatch({ type: INVITE_ERROR, payload: err.response.data.msg });
    }
  };

  //set loading
  const setLoading = () => {
    //console.log(''setLoading')
    return { type: SET_INVITES_LOADING }
  };

  //clear invites
  const clearInvites = () => {
    //console.log(''clearInvites')
    dispatch({ type: CLEAR_INVITES });
  };

  return (
    <InviteContext.Provider
    value={{
      invites: state.invites,
      invitesError: state.invitesError,
      invitesLoading: state.invitesLoading,
      getInvites,
      addInvite,
      deleteInvite,
      deleteInvites,
      clearInvites
    }}>
      {props.children}
    </InviteContext.Provider>
  )
};

export default InviteState;