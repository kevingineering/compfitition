import React, { useContext } from 'react';
import FriendContext from '../../../contexts/friends/friendContext';
import InviteContext from '../../../contexts/invites/inviteContext';
import InviteItem from './InviteItem';

const InviteTable = ({participants}) => {
  const {friends} = useContext(FriendContext);
  const {invites} = useContext(InviteContext);

  const participantIds = participants.map(participant => participant._id); 
  const inviteIds = invites.map(invite => invite._id);

  let friendList = friends.filter(friend => !participantIds.includes(friend._id));

  let inviteList = friendList.map(friend => {
    if (inviteIds.includes(friend._id))
      return <InviteItem friend={friend} isPending={true} key={friend._id}/>
    else 
      return <InviteItem friend={friend} isPending={false} key={friend._id}/>
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

export default InviteTable;