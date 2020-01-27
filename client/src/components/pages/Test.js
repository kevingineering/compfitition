import React from 'react';
import Chart from 'react-google-charts';

const Test = () => {
  const dataPoints = [['x', 'Total'], [0, 0]];
  let runningTotal = 0;
  for (let i = 1; i <= 20; i++) {
    runningTotal += i;
    dataPoints.push(
      [i, runningTotal]
    );
  }

  return (
  <div className='border'>
    <Chart
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={dataPoints}
      options={{
        tooltip: {

        },
        pointsVisible: true,
        legend: {
          position: 'none'
        },
        hAxis: {
          title: 'Days',
          minValue: 30,
          minorGridlines: {
            count: 0
          }
        },
        vAxis: {
          title: 'Miles',
          minorGridlines: {
            count: 0
          }
        },
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  </div>
  );
}
  
export default Test;