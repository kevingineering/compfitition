import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FriendContext from '../../../contexts/friends/friendContext';
import InviteItem from './InviteItem';

const Invites = ({participants, compId, compName, startDate, invites}) => {

  //TODO 
  
  console.log('Invites')

  const {friends} = useContext(FriendContext);

  //find friends of user who are not already in competition
  const participantIds = participants.map(participant => participant._id); 
  let friendList = friends.filter(friend => !participantIds.includes(friend._id));

  //create list of invites
  let inviteList = friendList.map(friend => {
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
  compId: PropTypes.string.isRequired,
  compName: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  invites: PropTypes.array.isRequired,
}

export default Invites;