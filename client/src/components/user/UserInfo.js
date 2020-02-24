import React from 'react';
import PropTypes from 'prop-types';

const UserInfo = ({current, setEditToggle, setPasswordToggle, setDeleteToggle}) => {

  const { firstName, lastName, alias, isSearchable, email } = current;

  return (
    <React.Fragment>
      <p>
        <strong>Name: &nbsp;&nbsp;&nbsp;</strong>
        {firstName} {lastName}
      </p>
      <p>
        <strong>Alias: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>
        {alias !== '' ? alias : 'none'}
      </p>
      <p>
        <strong>Email: &nbsp;&nbsp;&nbsp;&nbsp;</strong>
        {email}
      </p>
      <p>
        <strong>Privacy: &nbsp;</strong>
        Other users {isSearchable ? 'can' : 'cannot'} search for me using my name and email.
      </p>
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

export default UserInfo;