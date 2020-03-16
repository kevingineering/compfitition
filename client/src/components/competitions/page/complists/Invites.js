import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FriendContext from '../../../../contexts/friends/friendContext';
import InviteItem from './InviteItem';

const Invites = ({participants, invitees, requests, compId, compName, startDate, invites}) => {

  //console.log{'Invites')

  const {friends} = useContext(FriendContext);
  
  //get friends who are not already participating in competition
  const participantIds = participants.map(participant => participant._id); 
  let userList = friends.filter(friend => !participantIds.includes(friend._id));
  
  //eliminate users who have requested to join competition
  const requestIds = requests.map(request => request._id)
  userList = userList.filter(user => !requestIds.includes(user._id))
  
  //eliminate friends who are already invited - they will be added back in below
  const inviteeIds = invitees.map(invitee => invitee._id);
  userList = userList.filter(user => !inviteeIds.includes(user._id));

  //add all invitees (including friends) to userList
  userList = [...userList, ...invitees]

  //create list of invites
  let inviteList = userList.map(friend => {
    //determine if user is already invited
    const invite = invites.find(invite => invite.userId === friend._id)
    return (
      <InviteItem 
        key={friend._id} 
        friend={friend} 
        inviteId={invite ? invite._id : ''}
        compId={compId} 
        compName={compName} 
        startDate={startDate}
      />)
  });

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Invites</h3>
        </li>
        {inviteList}
        <hr/>
      </ul>
    </div>
  );
};

Invites.propTypes = {
  participants: PropTypes.array.isRequired,
  invitees: PropTypes.array,
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  invites: PropTypes.array.isRequired,
}

export default Invites;