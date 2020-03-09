import React from 'react';
import Chart from 'react-google-charts';
import PropTypes from 'prop-types';

const GoalChartDifference = ({ duration, units, record, time }) => {

 //console.log{'GoalChartDifference')

  //format data array and configure tooltip
  const dataPoints = [
    [
      'x', 
      'Daily', 
      { role: 'tooltip', type: 'string', p: { html: true }},
    ],
    [
      0,
      record[0],
      `Start \n ${record[0]} ${units}`
    ]
  ];

  const chartMax = (time === duration) ? duration : time + 1;

  //set dataPoints - time + 1 because we are storing start value in [0]
  for (let i = 1; i <= time + 1; i++) {
    if (record[i] !== null) {
      dataPoints.push([
        i, 
        record[i], 
        `Day ${i} \n ${record[i]} ${units}`,
      ]);
    }
  }

  return (
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
            position: 'none'
          },
          vAxis: {
            textPosition: 'none',
            baselineColor: 'none'
          },
          titlePosition: 'none',
        }}
      />
    </div>
  );
};

GoalChartDifference.propTypes = {
  duration: PropTypes.number.isRequired,
  units: PropTypes.string.isRequired,
  record: PropTypes.array.isRequired,
  time: PropTypes.number.isRequired
};
  
export default GoalChartDifference;