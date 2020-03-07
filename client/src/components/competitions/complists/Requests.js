import React from 'react'
import RequestItem from './RequestItem'
import PropTypes from 'prop-types'

const Requests = ({requests}) => {

  let requestList = requests.map(request => { 
    return (
      <RequestItem
        key={request._id}
        request={request}
      />
  )})

  return (
    <div className='competition-lists-container'>
      <ul className='collection'>
        <li className='collection-header'>
          <h3>Requests</h3>
        </li>
        {requestList}
        <hr/>
      </ul>
    </div>
  )
}

Requests.propTypes = {
  requests: PropTypes.array.isRequired
}

export default Requests