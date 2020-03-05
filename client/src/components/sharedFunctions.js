import moment from 'moment';

// const timeHours = moment().startOf('day').diff(startDate, 'hours');

export const getTime = (startDate) => moment().startOf('day').diff(startDate, 'days');

// const utcTime = moment.utc().startOf('day').diff(startDate, 'days');

//decide if a competition has started
//get the utcTime
//get the current time

export const verifyDates = (startDate, started, duration) => {
  const time = getTime(startDate);

  //verify start date not in past
  if(time > 0 && !started) {
    return 'Start date cannot be in the past.';
  }
  
  //verify finish date not in past
  if(duration - time < 0){
    return 'Finish date cannot be in the past.';
  }
};

export const handleGoalChange = (e, setGoal, goal) => {
  if (e.target.name === 'duration' || 
    e.target.name === 'total' || 
    e.target.name === 'initialValue') {
    if (e.target.value === '') 
      setGoal({ ...goal, [e.target.name]: ''});
    else 
      setGoal({ ...goal, [e.target.name]: parseInt(e.target.value)});
  }
  else if (e.target.name === 'type' && 
    e.target.value === 'pass/fail')
    setGoal({ ...goal, total: 7, type: 'pass/fail' });
  else
    setGoal({
      ...goal, 
      [e.target.name]: e.target.value
    });
};

//http://there4.io/2012/05/02/google-chart-color-list/
//https://htmlcolorcodes.com/
//not currently using, was originally for google charts
// export const getColors = () => {
//   const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
//   const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
//   let lineColors;

//   if (backgroundColor === '#FFFFFF')
//     lineColors = [
//       '#3366CC',
//       '#DC3912',
//       '#109618',
//       '#FF9900',
//       '#990099',
//       '#95A5A6',
//       '#34495E',
//       '#3498DB',
//       '#1ABC9C',
//       '#F1C4OF',
//     ];
//   else 
//     lineColors = [
//       '#1A5276',
//       '#7B241C',
//       '#196F3D',
//       '#9C640C',
//       '#5B2C6F',
//       '#5F6A6A',
//       '#212F3C',
//       '#21618C',
//       '#117864',
//       '#9A7D0A',
//     ];

//   return [primaryColor, backgroundColor, lineColors]
// }