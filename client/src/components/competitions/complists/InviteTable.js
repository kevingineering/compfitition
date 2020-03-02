import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FriendContext from '../../../contexts/friends/friendContext';
import LetterContext from '../../../contexts/letters/letterContext';
import InviteItem from './InviteItem';

const InviteTable = ({participants, compId}) => {
  const {friends} = useContext(FriendContext);
  const {letters} = useContext(LetterContext);

  const participantIds = participants.map(participant => participant._id); 
  const letterIds = letters.map(letter => letter._id);

  let friendList = friends.filter(friend => !participantIds.includes(friend._id));

  let inviteList = friendList.map(friend => {
    if (letterIds.includes(friend._id))
      return <InviteItem friend={friend} isPending={true} key={friend._id} compId={compId}/>
    else 
      return <InviteItem friend={friend} isPending={false} key={friend._id} compId={compId}/>
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

InviteTable.propTypes = {
  participants: PropTypes.array.isRequired,
  compId: PropTypes.string.isRequired
}

export default InviteTable;