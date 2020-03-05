import React from 'react';
import Chart from 'react-google-charts';
import PropTypes from 'prop-types';

const CompChartDifference = ({competitionArray, units, time, duration}) => {

  //format data array and configure tooltip 
  let dataPointsZero = ['x'];
  let dataPointsOne = [0];
  let dataPointsBeyond = [];

  //the length of the values coming after
  //has fewer edge cases than using time
  let valuesLength = 0;
  if (competitionArray.length !== 0) {
    valuesLength = competitionArray[0][2].length;
  }

  //configure dataPoints [0] and[1]
  for (let i = 0; i < competitionArray.length; i++) {
    dataPointsZero.push(
      competitionArray[i][0],
      { role: 'tooltip', type: 'string', p: { html: true }}
    )
    dataPointsOne.push(
      0, 'Start'
    )
  }

  //configure rest of dataPoints
  let maxValue = 0;
  let minValue = 0;
  for (let i = 1; i < valuesLength; i++) {
    let list = [i];
    for (let j = 0; j < competitionArray.length; j++) {
      let value = (competitionArray[j][2][i] === null) ? 
        null :
        competitionArray[j][2][i] - competitionArray[j][2][0];
      if (value < minValue) minValue = value;
      if (value > maxValue) maxValue = value;
      list.push(
        value,
        `Day ${i}
        Change: ${value > 0 ? '+' : ''}${value} ${units}
        Current: ${competitionArray[j][2][i]} ${units}`
      )
    }
    dataPointsBeyond.push(list);
  }

  let dataPoints = [dataPointsZero, dataPointsOne, ...dataPointsBeyond];

  const chartMax = (time === duration) ? duration : time + 1;

  return (
    competitionArray.length === 0 ? 
    <div className='border'>Loading Chart</div> :
    <div className='border'>
      <Chart
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={dataPoints}
        options={{
          chartArea: {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          },
          interpolateNulls: true,
          axisTitlesPosition: 'none',
          hAxis: {
            textPosition: 'none',
            baselineColor: 'none',
            gridlines: {
              color: 'transparent'
            },
            viewWindow: {
              min: 0
            },
            maxValue: chartMax
          },
          legend: {
            position: 'in'
          },
          vAxis: {
            textPosition: 'none',
            baselineColor: 'none',
            minValue: minValue - 1,
            maxValue: maxValue + 1,
          },
          titlePosition: 'none',
        }}
      />
    </div>
  )
}

CompChartDifference.propTypes = {
  competitionArray: PropTypes.array.isRequired,
  units: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
}

export default CompChartDifference;