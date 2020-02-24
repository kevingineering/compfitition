import React from 'react';
import PropTypes from 'prop-types';

const Input = ({name, label, type, value, handleChange, min, max, autofocus, disabled, warning}) => {
  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        {...(min && {min: min})}
        {...(max && {max: max})}
        {...(disabled && {disabled: true})}
        {...(autofocus && {autofocus: true})}
      />
      {warning && <span>{warning}</span>}
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  //value type can vary
  handleChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  autofocus: PropTypes.bool,
  disabled: PropTypes.bool,
  warning: PropTypes.string
}

export default Input;