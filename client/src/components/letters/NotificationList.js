import React from 'react';
import NotificationItem from './NotificationItem';
import PropTypes from 'prop-types';

const NotificationList = ({letters}) => {

  console.log('NotificationList')

  let letterList = (
    <React.Fragment>
      {letters.map(letter => {
        return <NotificationItem 
          letter={letter}
          key={letter._id}
        />
      }
      )}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      {letterList}
    </React.Fragment>
  )
}

NotificationList.propTypes = {
  letters: PropTypes.array.isRequired,
}

export default NotificationList;