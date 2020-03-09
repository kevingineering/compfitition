const CreateArray = (competitionParticipants, competitionGoals, type, time, duration, isMax) => {

  //create array used for leaderboard and chart - Array = [name, total, [runningTotals]]
  let competitionArray = [];
  
  competitionArray = competitionGoals.map(goal => {
    //calc total to date
    const {tracker} = goal;
    let count = 0;
    if (type === 'pass/fail'){
      for (let i = 0; i < tracker.length; i++) {
        if (tracker[i]) count++;
      }
    }
    else if (type === 'total') {
      for (let i = 0; i < tracker.length; i++) {
        count += tracker[i];
      }
    }
    else if (type === 'difference') {
      let temp = tracker.filter(value => value !== null)
      if (temp.length > 1)
        count = temp.pop() - temp[0];
      else
        count = 0;
    }

    //pair user name with goal
    let temp = competitionParticipants.find(user => user._id === goal.user);
    let name = temp.alias ? temp.alias : temp.firstName;

    //get tracker values to date (for chart)
    let trackerValues = [];
    let runningTotal = 0;
    const length = time < duration ? time + 1 : duration;
    if (type === 'pass/fail'){
      for (let i = 0; i < length; i++) {
        if (tracker[i]) runningTotal++;
        trackerValues.push(runningTotal);
      }
    }
    else if (type === 'total') {
      for (let i = 0; i < length; i++) {
        runningTotal += tracker[i];
        trackerValues.push(runningTotal);
      }
    }
    else if (type === 'difference') {
      //slice is time + 2 because 0th value is start and we want to include today which is time + 1
      let values = tracker.slice(0, time + 2);
      //ensure last value of array is not null
      if (values.slice(-1)[0] === null) {
        values.pop()
        values.push(count + values[0])
      }
      trackerValues.push(...values);
    }
    //package in array
    return [name, count, trackerValues]
  })

  //sort competitionArray
  if (isMax)
    competitionArray.sort((a, b) => b[1] - a[1]);
  else 
    competitionArray.sort((a, b) => a[1] - b[1]);

  return competitionArray;
};

export default CreateArray;