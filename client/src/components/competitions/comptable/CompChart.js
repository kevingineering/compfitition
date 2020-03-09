import React from 'react';
import PropTypes from 'prop-types';
import CompChartDifference from './CompChartDifference';
import CompChartTotal from './CompChartTotal';

const CompChart = ({competitionArray, goal, time}) => {
  const {duration, units, type} = goal;

 //console.log{'CompChart')

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

CompChart.propTypes = {
  competitionArray: PropTypes.array.isRequired,
  goal: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired
}

export default CompChart;