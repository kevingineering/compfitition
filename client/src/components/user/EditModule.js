import React from 'react';
import PropTypes from 'prop-types';
import Input from '../formComponents/Input';
import Switch from '../formComponents/Switch';

const EditModule = ({current, handleChange, handleClick, setEditToggle, setAlert, updateUser}) => {

 //console.log{'EditModule')

  const handleEdit = async () => {
    if (firstName === '') 
      setAlert('Please enter a first name.');
    else if (lastName === '')
      setAlert('Please enter a last name.');
    else if (email === '')
      setAlert('Please enter an email.');
    else {
      await updateUser(current);
    }
  };

  const { firstName, lastName, alias, email, isSearchable } = current;

  return (
    <form autoComplete='off'>
        {/*First Name*/}
        <Input
          label='First Name'
          type='text'
          value={firstName}
          name='firstName'
          handleChange={handleChange}
        />
        {/*Last Name*/}
        <Input
          label='Last Name'
          type='text'
          value={lastName}
          name='lastName'
          handleChange={handleChange}
        />
        {/*Alias*/}
        <Input
          label='Alias (optional - the name your friends will see)'
          type='text'
          value={alias}
          name='alias'
          handleChange={handleChange}
        />
        {/*Email Address*/}
        <Input
          label='Email Address'
          type='email'
          value={email}
          name='email'
          handleChange={handleChange}
        />
        {/*Privacy*/}
        <Switch 
          label='Privacy'
          isChecked={isSearchable}
          name='isSearchable'
          handleClick={handleClick}
          msgChecked='Other users are allowed to search for my name and email so they can add me as a friend.'
          msgBlank='Other users are not allowed to search for my name and email.'
        />
        {/*Save Button*/}
        <input 
          value='Save User'
          type='button'
          className='btn btn-block btn-primary'
          onClick={handleEdit}
        />
        <input
          value='Cancel'
          type='button'
          className='btn btn-block btn-primary'
          onClick={() => setEditToggle(false)}
        />
      </form>
  )
}

EditModule.propTypes = {
  current: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  setEditToggle: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
}

export default EditModule;