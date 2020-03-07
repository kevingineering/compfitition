import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({label, name, isChecked, handleClick, msgChecked, msgBlank}) => {

  //console.log('Switch')

  return (
    <div className="form-group">
      <label className='block'>{label}</label>
      <label className='switch'>
        <input
          type='checkbox'
          checked={isChecked}
          name={name}
          onChange={handleClick}
        />
        <span className='slider round'/>
      </label>
      <li className='register-span'>
        {isChecked ? msgChecked : msgBlank} 
      </li>
    </div>
  )
}

Switch.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  msgChecked: PropTypes.string.isRequired,
  msgBlank: PropTypes.string.isRequired
}

export default Switch;