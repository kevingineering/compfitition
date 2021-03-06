import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import userimg from '../../resources/userimg.png'
import RequestContext from '../../contexts/requests/requestContext'
import FriendContext from '../../contexts/friends/friendContext'

const SearchItem = ({status, user: {firstName, lastName, email, _id}}) => {

 //console.log{'SearchItem')

  let history = useHistory()

  const requestContext = useContext(RequestContext)
  const { addRequest, deleteRequest } = requestContext

  const friendContext = useContext(FriendContext)
  const { addFriend, setCurrentFriend } = friendContext

  //configure button(s) based on status
  let buttonMsg = 'Add'
  if (status === 'friend') {
    buttonMsg = 'Friend!'
  } else if (status === 'received') {
    buttonMsg = 'Accept'
  } else if (status === 'sent') {
    buttonMsg = 'Delete'
  }

  const handleClick = e => {
    if (status === 'stranger') {
      addRequest(_id)
    } else if (status === 'friend') {
      setCurrentFriend(_id)
      history.push('/friend')
    } else if (status === 'received' && e.target.name === 'btn1') {
      addFriend(_id)
      deleteRequest(_id)
    } else if (status === 'received' && e.target.name === 'btn2') {
      deleteRequest(_id)
    } else if (status === 'sent') {
      deleteRequest(_id)
    }
  }
  
  const avatar = null

  return (
    <li className='search-item'>
      {status === 'received' &&
        <p className='center btn-primary'>
          {firstName} sent you a friend request!
        </p>
      }
      {status === 'sent' &&
        <p className='center btn-primary'>
          You sent {firstName} a friend request!
        </p>
      }
      <div className='search-link'>
        <div className="flex">
          <img
            src={avatar !== null ? avatar : userimg}
            alt={firstName.charAt(0)}
          />
        </div>
        <div className='search-container'>
          <span className='search-name'>{firstName} {lastName}</span>
          <br/>
          <span className='search-email'>{email}</span>
        </div>
        <div className='right'>
          <button
            className={`search-btn btn-primary block`}
            onClick={handleClick}
            name='btn1'
          >
            {buttonMsg}
          </button>
          {status === 'received' &&
            <button
              className='search-btn btn-primary block'
              onClick={handleClick}
              name='btn2'
            >
              Reject
            </button>
          }
        </div>
      </div>
    </li>
  )
}

SearchItem.propTypes = {
  user: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
}

export default SearchItem