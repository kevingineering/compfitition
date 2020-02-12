import React from 'react';
import GoalChartDifference from './GoalChartDifference';
import GoalChartTotal from './GoalChartTotal';
import GoalChartPassFail from './GoalChartPassFail';

const GoalChart = ({goal, record, setRecord, time, isComplete, isOwner, isStarted}) => {
  const {duration, units, total, type, startDate} = goal;

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
          isStarted={isStarted}
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

export default GoalChart;