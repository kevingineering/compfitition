//create tracker array - length is: 
  //'total' - number of days
  //'difference' - number of days plus one (start value)
  //'pass/fail' - number of weeks times number of days per week
const createTracker = (newDuration, total, type, initialValue) => {
  let length = newDuration;
  if (type === 'pass/fail') {
    length = newDuration / 7 * total;
  } else if (type === 'difference') {
    length += 1;
  }

  let tracker = new Array(length);
  if (type === 'total') {
    tracker = tracker.fill(0);
  }
  if (type === 'difference') {
    tracker[0] = initialValue;
  }

  return tracker;
}

//update tracker
const updateTracker = (newDuration, total, type, tracker) => {
  let length = newDuration - tracker.length;
  if (type === 'pass/fail') {
    length = newDuration / 7 * total - tracker.length;
  } else if (type === 'duration') {
    length = newDuration + 1 - tracker.length;
  }
  
  if (length < 0) 
    newTracker = tracker.splice(0, newDuration);
  else if ( type === 'total')
    newTracker = tracker.concat(new Array(length).fill(0))
  else 
    newTracker = tracker.concat(new Array(length).fill(null));

  return newTracker;
}

exports.createTracker = createTracker;
exports.updateTracker = updateTracker;