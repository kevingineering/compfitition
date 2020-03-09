import React from 'react';
import PropTypes from 'prop-types';

const Input = ({name, label, type, value, handleChange, min, max, autofocus, disabled, warning}) => {
  
  //console.log('Input')

  return (
    <div className={`form-group ${disabled && 'disabled'}`}>
      <label htmlFor={name}>{label}</label>
        {type !== 'textarea' ? (
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
        ) : (
          <textarea
            value={value}
            name={name}
            onChange={handleChange}
            rows='3'
            {...(disabled && {disabled: true})}
            {...(autofocus && {autofocus: true})}
          />
        )}
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
  warning: PropTypes.object
}

export default Input;