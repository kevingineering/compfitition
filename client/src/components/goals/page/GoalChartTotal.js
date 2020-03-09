import React from 'react';
import Chart from 'react-google-charts';
import PropTypes from 'prop-types';

const GoalChartTotal = ({ units, record, time }) => {
  
 //console.log{'GoalChartTotal')
  
  //format data array and configure tooltip
  const dataPoints = [[
    'x', 
    'Daily', 
    { role: 'tooltip', type: 'string', p: { html: true }},
    'Total', 
    { role: 'tooltip', type: 'string', p: { html: true }}
  ], [
    0, 0, 'Start', 0, 'Start'
  ]];

  //populate data array
  let runningTotal = 0;
  for (let i = 0; i <= time; i++) {
    runningTotal += record[i]
    dataPoints.push([
      i + 1, 
      record[i], 
      `Day ${i + 1} \n Daily: ${record[i]} ${units}`,
      runningTotal, 
      `Day ${i + 1} \n Total: ${runningTotal} ${units}`
    ]);
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
          }
        },
        legend: {
          position: 'in',
        },
        vAxis: {
          textPosition: 'none',
          baselineColor: 'none',
        },
        titlePosition: 'none',
      }}
    />
  </div>
  );
};

GoalChartTotal.propTypes = {
  units: PropTypes.string.isRequired,
  record: PropTypes.array.isRequired,
  time: PropTypes.number.isRequired
};
  
export default GoalChartTotal;