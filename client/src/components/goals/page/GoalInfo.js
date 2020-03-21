import React from 'react'
import { round } from 'mathjs'
import moment from 'moment'
import PropTypes from 'prop-types'

const GoalInfo = ({goal, time, record, value, isStarted}) => {

 //console.log{'GoalInfo')

  const { duration, startDate, description, units, total, type } = goal

  let topLeftTag = 'Start Date: '
  let topLeftMsg = `${moment.utc(startDate).format('MMMM Do, YYYY')}`
  let topRightTag = null
  let topRightMsg = null
  let middleLeftTag = null
  let middleLeftMsg = null
  let middleRightTag = null
  let middleRightMsg = null
  let bottomLeftTag = null
  let bottomLeftMsg = null
  let bottomRightTag = null
  let bottomRightMsg = null

  if (isStarted) {
    //difference
    if (type === 'difference') {
      topRightTag = (time === duration) ? 'Duration: ' : 'Day: '
      topRightMsg = (time === duration) ? `${duration} days` : `${time + 1} / ${duration}`
      middleLeftTag = 'Start: '
      middleLeftMsg = `${record[0]} ${units}`
      middleRightTag = 'Goal: '
      middleRightMsg = `${total} ${units}`
      bottomLeftTag = (time === duration) ? 'Final: ' : 'Current: '
      bottomLeftMsg = (time === duration) ? `${record[0] + value} ${units}` : `${record[0] + value} ${units}`
      bottomRightTag = 'Change: '
      bottomRightMsg = `${value > 0 ? '+' : ''}${value} ${units}`
    }
    //total
    else if (type === 'total') {
      topRightTag = (time === duration) ? 'Duration: ' : 'Day: '
      topRightMsg = (time === duration) ? `${duration} days` : `${time + 1} / ${duration}`
      middleLeftTag = 'Total: '
      middleLeftMsg = `${value} / ${total} ${units}`
      middleRightTag = 'Goal Completion: '
      middleRightMsg = `${round(value / total * 100)}%`
    }
    //pass/fail
    else if (type === 'pass/fail') {
      topRightTag = null
      topRightMsg = null
      middleLeftTag = 'Success To Date: '
      middleLeftMsg = `${value} / ${time > duration ? record.length : time + 1} (${round(value / (time + 1) * 100)}%)`
      bottomLeftTag = 'Success Total: '
      bottomLeftMsg = `${value} / ${record.length} (${round(value / record.length * 100)}%)`
    }
  }

  if (!isStarted) {
    topLeftTag = 'Begins: '
    topLeftMsg = `${moment.utc(startDate).format('MMMM Do, YYYY')}`
    topRightTag = 'Duration: '
    topRightMsg = `${duration} days`
    if (type === 'difference') {
      middleLeftTag = 'Start: '
      middleLeftMsg = `${record[0]} ${units}`
      middleRightTag = 'Goal: '
      middleRightMsg = `${total} ${units}`
    }
    else if (type === 'total') {
      middleLeftTag = 'Goal: '
      middleLeftMsg = `${total} ${units}`
    }
  }
  
  return (
    <React.Fragment>
      {description &&
        <React.Fragment>
          <li className='table-info lr-border'>
            <span><strong>Description: </strong>{description}</span>
          </li>
        </React.Fragment>
      }
      <li className='table-info lr-border'>
        <div className='space-between'>
          <span>
            <strong>{topLeftTag}</strong>{topLeftMsg}
          </span>
          <span className='right'>
            <strong>{topRightTag}</strong>{topRightMsg}
          </span>
        </div>
      </li>
      {type === 'pass/fail' && (time === duration || !isStarted) ? null :
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              <strong>{middleLeftTag}</strong>{middleLeftMsg}
            </span>
            <span className='right'>
              <strong>{middleRightTag}</strong>{middleRightMsg}
            </span>
          </div>
        </li>
      }
      {type !== 'total' && isStarted &&
        <li className='table-info lr-border'>
          <div className='space-between'>
            <span>
              <strong>{bottomLeftTag}</strong>{bottomLeftMsg}
            </span>
            <span className='right'>
              <strong>{bottomRightTag}</strong>{bottomRightMsg}
            </span>
          </div>
        </li>
      }
    </React.Fragment>
  )
}

GoalInfo.propTypes = {
  goal: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  record: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
  isStarted: PropTypes.bool.isRequired
}
export default GoalInfo