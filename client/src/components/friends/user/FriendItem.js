import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import FriendContext from '../../../contexts/friends/friendContext'
import AlertContext from '../../../contexts/alerts/alertContext'
import userimg from '../../../resources/userimg.png'

const FriendItem = ({friend: {firstName, lastName, alias, _id}}) => {

 //console.log{'FriendItem')

  const friendContext = useContext(FriendContext)
  const { friendIds, setCurrentFriend } = friendContext

  const alertContext = useContext(AlertContext)
  const { setAlert } = alertContext

  //TODO - change routing and get current friend on friend page? 
  const handleClick = () => {
    if (friendIds.includes(_id)) {
      setCurrentFriend(_id)
    }
    else setAlert('You are not friends with this user.')
  }

  const avatar = null

  return (
    <li className='search-item'>
      <Link className = 'search-link' onClick={handleClick} to={'/friend'}>
        <div className="flex">  
          <img
            src={avatar !== null ? avatar : userimg}
            alt={firstName.charAt(0)}
          />
        </div>
        <div className='friend-container'>
          <h3 className='inline'>{firstName} {lastName}</h3>
          {alias !== '' ? (
            <React.Fragment>
              <span> aka </span>
              <h3 className='inline italics'>'{alias}'</h3>
            </React.Fragment>
          ) : null}
        </div>
      </Link>
    </li>
  )
}

FriendItem.propTypes = {
  friend: PropTypes.object.isRequired
}

export default FriendItem
