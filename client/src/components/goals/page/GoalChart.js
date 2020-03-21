import React from 'react'
import PropTypes from 'prop-types'
import GoalChartDifference from './GoalChartDifference'
import GoalChartTotal from './GoalChartTotal'
import GoalChartPassFail from './GoalChartPassFail'

const GoalChart = ({goal, record, setRecord, time, isComplete, isOwner}) => {

 //console.log{'GoalChart')

  const {duration, units, total, type, startDate} = goal

  return (
    <div>
      {type === 'difference' &&
        <GoalChartDifference 
          duration={duration} 
          units={units} 
          total={total} 
          record={record} 
          time={time}
        />
      }
      {type === 'total' &&
      <GoalChartTotal 
          units={units} 
          record={record} 
          time={time}
        />
      }
      {type === 'pass/fail' &&
        <GoalChartPassFail
          duration={duration} 
          isComplete={isComplete}
          isOwner={isOwner}
          units={units} 
          total={total} 
          setRecord={setRecord}
          startDate={startDate}
          record={record} 
          time={time}
        />
      }
    </div>
  )
}

GoalChart.propTypes = {
  goal: PropTypes.object.isRequired,
  record: PropTypes.array.isRequired,
  setRecord: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired
}

export default GoalChart