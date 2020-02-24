import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import letterContext from '../../../contexts/letters/letterContext';

const LetterItem = ({friend: {firstName, lastName}, isPending}) => {

  const [letterToggle, setLetterToggle] = useState(false)

  const { addLetter, deleteLetter } = useContext(letterContext);

  //compId, message (adminname, compname), userId, startDate

  return (
    <React.Fragment>
      {letterToggle && <hr/>}
      <div className='participant-row space-between lr-border'>
        <span className='block'>{firstName} {lastName}</span>
        <button 
          className='btn-participants btn-primary'
          onClick={() => setLetterToggle(!letterToggle)}
        >
          <i className={letterToggle ? 'fas fa-minus' : 'fas fa-plus'}/>
        </button>
      </div>
      {letterToggle &&
        <div className="lr-border">
          <span className='participant-row block'>
            {isPending ? 'Delete this user\'s letter?' : 'Letter this user to join competition?'}
          </span>
          <input
            type='button'
            value='No'
            className='btn btn-primary btn-split'
            onClick={() => setLetterToggle(false)}
            style={{margin: 0}}
          />
          <input
            type='button'
            value='Yes'
            className='btn btn-primary btn-split'
            onClick={() => {isPending ? deleteLetter() : addLetter()}}
            style={{margin: 0}}
          />
        </div>
      }
    </React.Fragment>
  )
}

LetterItem.propType = {
  friend: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired
}

export default LetterItem;