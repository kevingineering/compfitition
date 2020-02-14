const mongoose = require('mongoose');

const GoalSchema = mongoose.Schema({
  // user is ID of user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  // name is name of goal
  name: {
    type: String,
    required: true
  },
  // duration is time in days
  duration: {
    type: Number,
    required: true
  },
  // start date is day goal starts, not day created
  startDate: {
    type: Date,
    required: true
  },
  // type is kind of goal: 
    // 'pass/fail' (did you or didn't you, e.g ran today), 
    // 'total' (how many did you do, e.g. miles ran)
    // 'difference' (how many now versus how many at start, e.g weight loss)
  type: {
    type: String,
    required: true
  },
  // units are for 'total' and 'difference' types, can be lbs, miles, etc. as determined by user
  units: {
    type: String
  },
  // total is either: 
    // for type 'pass/fail' - number of times per week (7 is daily, minimum 1)
    // for 'total' and 'difference' goals - number of units a user wishes to achieve or gain/lose for 'total' and 'difference'
    // for 'difference' competitions - 1 means highest score wins, -1 means lowest score wins
  total: {
    type: Number,
    required: true
  },
  // isPrivate determines who can see the goal: only the user if true, the user's friends if false
  isPrivate: {
    type: Boolean,
    required: true
  },
  // compId is the id of the competition associated with this goal (if one exists)
  compId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'competitions'
  },
  // tracker is an array that keeps track of pass/fail, total units, or starting/intermediate/finishing numbers (think weight loss)
  // tracker array is created by backend
  tracker: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Goal', GoalSchema);