import React from 'react';
import PropTypes from 'prop-types';

const LeaderboardItem = ({name, count, type}) => {

  let progress = (type === 'difference') ? `${count > 0 ? '+' : ''}${count}` : count;

  return (
    <div className='table-info space-between lr-border'>
      <span>{name}</span>
      <span>{progress}</span>
    </div>
  )
}

LeaderboardItem.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
}

export default LeaderboardItem;