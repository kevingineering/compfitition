import React from 'react'
import PropTypes from 'prop-types'

const UserInfo = ({current, setEditToggle, setPasswordToggle, setDeleteToggle}) => {

 //console.log{'UserInfo')

  const { firstName, lastName, alias, isSearchable, email } = current

  let message = `Other users ${isSearchable ? 'can' : 'cannot'} search for me using my name and email.`

  return (
    <React.Fragment>
      <ul>
        <li>
          <span className='width-80'>
            <strong>Name:</strong>
          </span>
          <span>
            {firstName} {lastName}
          </span>
        </li>
        <li>
          <span className='width-80'>
            <strong>Alias:</strong>
          </span>
          <span>
            {alias !== '' ? alias : 'none'}
          </span>
        </li>
        <li>
          <span className='width-80'>
            <strong>Email:</strong>
          </span>
          <span>
            {email}
          </span>
        </li>
        <li className='flex'>
          <span className='width-80'>
            <strong>Privacy:</strong>
          </span>
          <span>
            {message}
          </span>
        </li>
      </ul>
      <input
        type='button'
        value='Edit User'
        className='btn btn-block btn-primary'
        onClick={() => setEditToggle(true)}
      />
      <input
        type='button'
        value='Change Password'
        className='btn btn-block btn-primary'
        onClick={() => setPasswordToggle(true)}
      />
      <input
        type='button'
        value='Delete User'
        className='btn btn-block btn-primary'
        onClick={() => setDeleteToggle(true)}
      />
    </React.Fragment>
  )
}

UserInfo.propTypes = {
  current: PropTypes.object.isRequired,
  setEditToggle: PropTypes.func.isRequired,
  setPasswordToggle: PropTypes.func.isRequired,
  setDeleteToggle: PropTypes.func.isRequired
}

export default UserInfo