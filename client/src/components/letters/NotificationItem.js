import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LetterContext from '../../contexts/letters/letterContext';
import CompetitionContext from '../../contexts/competitions/competitionContext';

const NotificationItem = ({letter}) => {

 //console.log{'NotificationItem')

  const { deleteLetter } = useContext(LetterContext)

  const { getCompetition } = useContext(CompetitionContext);

  const { _id, message, type, compId } = letter

  let contents = '';

  const handleDismiss = e => {
    deleteLetter(_id);
    //TODO - rerender when letter deleted
  }

  const handleLink = async e => {
    await getCompetition(compId)
    //TODO - finish friend competition page, then add that here
  }

  //note 'fromUser' letters are filtered out by backend
  switch(type) {
    //link to competition page, accept or reject letter there
    case('toUser'):
    case('requestAdmin'):
      contents = (
        <Link 
          className='table-info block'
          onClick={handleLink} 
          to='/competition' 
        >
          {message}
        </Link>
      )
      break;
    //show and dismiss
    case('userAdded'):
    case('userKicked'):
    case('compDeleted'):
      contents = (
        <div className='search-link'>
          <div className='table-info'>{message}</div>
          <div className='right'>
            <button
              className={`search-btn btn-primary block`}
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      )
      break;
    default:
      break;
  }

  return (
    <li className='search-item'>
      {contents}
    </li>
  )
}

NotificationItem.propTypes = {
  letter: PropTypes.object.isRequired
}

export default NotificationItem;