import moment from 'moment';

// const timeHours = moment().startOf('day').diff(startDate, 'hours');

const getTime = (startDate) => moment().startOf('day').diff(startDate, 'days');

// const utcTime = moment.utc().startOf('day').diff(startDate, 'days');

//decide if a competition has started
//get the utcTime
//get the current time

const verifyDates = (startDate, started, duration) => {
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

const handleGoalChange = (e, setGoal, goal) => {
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

export { verifyDates, handleGoalChange }