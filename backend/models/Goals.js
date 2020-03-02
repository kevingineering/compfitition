const mongoose = require('mongoose');

//note that there are three kinds of goals:
  //solo goal
      //created when a user adds a goal
      //has userId as user
      //compId is null
  //user competition goal
      //created from template goal when a user joins a competition (including the user who created the competition)
      //if competition is deleted, becomes a solo goal
      //has userId as user
      //compId indicates competition
  //competition template goal
      //created when user adds a competition
      //user competition goals are created by copying this goal
      //has compId as user
      //compId is null
        //otherwise competition would find it when getting user goals which is not desired
const GoalSchema = mongoose.Schema({
  // user is userId of user or compId of competition (for template goal)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
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
    // for type 'pass/fail': number of times per week (7 is daily, minimum 1)
    // for 'total' and 'difference' solo goals: number of units a user wishes to achieve or gain/lose for 'total' and 'difference'
    // for 'total' and 'difference' competitions: -1 means lowest score wins, any other number means highest score wins
  total: {
    type: Number,
    required: true
  },
  // isPrivate determines who can see the goal: only the user if true, the user's friends if false
  isPrivate: {
    type: Boolean,
    required: true
  },
  // compId indicates competition associated with this goal (if one exists)
  compId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Competition'
  },
  // tracker is an array that keeps track of pass/fail, total units, or starting/intermediate/finishing numbers (think weight loss)
  // tracker array is created by backend
  tracker: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Goal', GoalSchema);