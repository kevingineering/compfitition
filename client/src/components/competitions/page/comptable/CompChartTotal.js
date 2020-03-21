import React from 'react'
import Chart from 'react-google-charts'
import PropTypes from 'prop-types'

const CompChartTotal = ({competitionArray, units, type }) => {
 //console.log{'CompChartTotal')

  //format data array and configure tooltip 
  let dataPointsZero = ['x']
  let dataPointsOne = [0]
  let dataPointsBeyond = []

  //the length of the values coming after
  //has fewer edge cases than using time
  let valuesLength = 0
  //the maximum value for the chart, one more than the leader's score
  let maxValue = 0

  if (competitionArray.length !== 0) {
    valuesLength = competitionArray[0][2].length
    const max1 = competitionArray[0][1] + 1
    const max2 = competitionArray[competitionArray.length -1][1] + 1
    maxValue = max1 > max2? max1 : max2
  }

  let tooltipMsg = type === 'total' ? 'Total: ' : 'Successes: '

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
  for (let i = 0; i < valuesLength; i++) {
    let list = [i + 1]
    for (let j = 0; j < competitionArray.length; j++)
      list.push(
        competitionArray[j][2][i],
        `Day ${i + 1} \n ${tooltipMsg} ${competitionArray[j][2][i]} ${units}`
      )
    dataPointsBeyond.push(list)
  }

  let dataPoints = [dataPointsZero, dataPointsOne, ...dataPointsBeyond]
  
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
            position: 'in'
          },
          vAxis: {
            textPosition: 'none',
            baselineColor: 'none',
            viewWindow: {
              max: maxValue
            }
          },
          titlePosition: 'none',
        }}
      />
    </div>
  )
}

CompChartTotal.propTypes = {
  competitionArray: PropTypes.array.isRequired,
  units: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default CompChartTotal