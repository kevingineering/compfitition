import React from 'react';
import Chart from 'react-google-charts';

const GoalChart = ({ units, record, time }) => {
  //format data array and configure tooltip
  const dataPoints = [[
    'x', 
    'Daily', 
    { role: 'tooltip', type: 'string', p: { html: true }},
  ]];

  //populate data array
  for (let i = 0; i <= time; i++) {
    if (record[i] !== null) {
      dataPoints.push([
        i + 1, 
        record[i], 
        `Day ${i + 1} \n ${record[i]} ${units}`,
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
              min: 1
            },
            maxValue: time + 1
          },
          legend: {
            position: 'none'
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
}
  
export default GoalChart;