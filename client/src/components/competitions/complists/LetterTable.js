import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FriendContext from '../../../contexts/friends/friendContext';
import letterContext from '../../../contexts/letters/letterContext';
import LetterItem from './LetterItem';

const LetterTable = ({participants}) => {
  const {friends} = useContext(FriendContext);
  const {letters} = useContext(letterContext);

  const participantIds = participants.map(participant => participant._id); 
  const letterIds = letters.map(letter => letter._id);

  let friendList = friends.filter(friend => !participantIds.includes(friend._id));

  let letterList = friendList.map(friend => {
    if (letterIds.includes(friend._id))
      return <LetterItem friend={friend} isPending={true} key={friend._id}/>
    else 
      return <LetterItem friend={friend} isPending={false} key={friend._id}/>
  });

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Letters</h3>
        </li>
        {letterList}
        <hr/>
      </ul>
    </div>
  );
};

LetterTable.propTypes = {
  participants: PropTypes.array.isRequired
}

export default LetterTable;