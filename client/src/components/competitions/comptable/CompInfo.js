import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const CompInfo = ({goal, time, record, value, isStarted}) => {

  const { duration, startDate, description, units, type } = goal;

  let topLeftTag = 'Start Date: '
  let topLeftMsg = moment.utc(startDate).format('MMMM Do, YYYY')
  let topRightTag = (time === duration) ? 'Duration: ' : 'Day: '
  let topRightMsg = (time === duration) ? `${duration} days` : `${time + 1} / ${duration}`;
  let bottomLeftTag = null;
  let bottomLeftMsg = null;
  let bottomRightTag = null;
  let bottomRightMsg = null;

  if (isStarted) {
    //difference
    if (type === 'difference') {
      bottomLeftTag = 'Start: '
      bottomLeftMsg = `${record[0]} ${units}`
      bottomRightTag = (time === duration) ? 'Final: ' : 'Change: '
      bottomRightMsg = (time === duration) ? 
        `${record[0] + value > 0 ? '+' : ''}${record[0] + value} ${units}` : 
        `${value > 0 ? '+' : ''}${value} ${units}`
    }
  }

  if (!isStarted) {
    topLeftTag = 'Begins: '
    topLeftMsg = `${moment.utc(startDate).format('MMMM Do, YYYY')}`
    topRightTag = 'Duration: '
    topRightMsg = `${duration} days`
    if (type === 'difference') {
      bottomLeftTag = 'Start: '
      bottomLeftMsg = `${record[0]} ${units}`;
    }
  }
  
  return (
    <React.Fragment>
      {description &&
        <React.Fragment>
          <li className='table-info lr-border'>
            <span><strong>Description: </strong>{description}</span>
          </li>
          <hr/>
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
      {type === 'difference' &&
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
      {type === 'difference' && record[0] === 0 && 
        <li className='table-info lr-border'>
          <span>
            Make sure to enter your starting value!
          </span>
        </li>
      }
    </React.Fragment>
  )
}

CompInfo.propTypes = {
  goal: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  record: PropTypes.array.isRequired,
  value: PropTypes.number.isRequired,
  isStarted: PropTypes.bool.isRequired
}

export default CompInfo;