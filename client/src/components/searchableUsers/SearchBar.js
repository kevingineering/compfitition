import React, { useRef } from 'react'
import PropTypes from 'prop-types'

const SearchBar = ({filter, clear}) => {

 //console.log{'SearchBar')

  //useState is async, so we use useRef which is sync
  const text = useRef('')

  const handleChange = e => {
    if (text.current.value)
      filter(e.target.value)
    else
      clear()
  }

  return (
    <form>
      <input 
        type='text'
        ref={text}
        placeholder='Search Users'
        onChange={handleChange}
      />
    </form>
  )
}

SearchBar.propTypes = {
  filter: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired
}

export default SearchBar