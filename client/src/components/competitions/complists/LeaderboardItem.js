import React from 'react'

const LeaderboardItem = ({name, count, type}) => {

  let progress = (type === 'difference') ? `${count > 0 ? '+' : ''}${count}` : count;

  return (
    <div className='table-info space-between lr-border'>
      <span>{name}</span>
      <span>{progress}</span>
    </div>
  )
}

export default LeaderboardItem;