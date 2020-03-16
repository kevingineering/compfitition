import React from 'react'
import PropTypes from 'prop-types'

const Select = ({name, label, value, disabled, handleChange, options}) => {
  let optionsList = options.map(option => {
    return <option value={option.value} key={option.value}>{option.text}</option>
  })
  return (
    <div className={`form-group ${disabled && 'disabled'}`}>
      <label htmlFor={name}>{label}
        <select
          disabled={disabled}
          name={name}
          value={value}
          onChange={handleChange}
        >
          {optionsList}
        </select>  
      </label>
    </div>
  )
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  //value can be number or string
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
}

export default Select