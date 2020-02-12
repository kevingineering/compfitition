import React from 'react';
import CompChartDifference from './CompChartDifference';
import CompChartTotal from './CompChartTotal';

const CompChart = ({competitionArray, goal, time}) => {
  const {duration, units, type} = goal;

  return (
    <div>
      {type === 'difference' &&
        <CompChartDifference 
          competitionArray={competitionArray}
          duration={duration} 
          units={units} 
          time={time}
        />
      }
      {(type === 'total' || type === 'pass/fail') &&
        <CompChartTotal 
          competitionArray={competitionArray}
          units={units} 
          type={type}
        />
      }
    </div>
  )
}

export default CompChart;