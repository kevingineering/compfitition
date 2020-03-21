import React, { useContext, useEffect } from 'react'
import LetterContext from '../../contexts/letters/letterContext'
import NotificationList from './NotificationList'

const Notifications = () => {

 //console.log{'Notifications')

  const { getLetters, letters } = useContext(LetterContext)

  useEffect(() => {
    getLetters()
    //eslint-disable-next-line
  }, [])

  return (
    letters.length === 0 ? null : (
      <ul className='collection'>
        <li className='collection-header'>
          <h2>Notifications</h2>
        </li>
        <NotificationList letters={letters}/>
      </ul>
    )
  )
}

export default Notifications