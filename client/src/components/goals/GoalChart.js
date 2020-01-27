import React from 'react';
import Chart from 'react-google-charts';

const GoalChart = ({ units, record, time }) => {
  //format data array and configure tooltip
  const dataPoints = [[
    'x', 
    'Daily', 
    { role: 'tooltip', type: 'string', p: { html: true}},
    'Total', 
    { role: 'tooltip', type: 'string', p: { html: true}}
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
          title: 'none',
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
          position: 'in'
        },
        vAxis: {
          title: 'Miles',
          textPosition: 'none',
          baselineColor: 'black',
        },
        titlePosition: 'none',
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  </div>
  );
}
  
export default GoalChart;