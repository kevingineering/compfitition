const Goal = require('../models/Goals');

//add new goal
exports.addNewGoal = async (goalFields, session = null) => {
  const goal = new Goal(goalFields);
  await goal.save({session: session});
  return goal;
}

//get goal by goalId
exports.getGoalById = async (goalId) => {
  const goal = await Goal.findById(goalId);
  return goal;
}

//get goals by userId
exports.getGoalsByUserId = async (userId) => {
  const goals = await Goal.find({ user: userId }).sort({ startDate: 1 });
  return goals;
}

//get goals by compId
exports.getGoalsByCompId = async (compId) => {
  const goals = await Goal.find({ compId: compId }).sort({ startDate: 1 });
  return goals;
}

//get friend goals that are not private
exports.getFriendGoals = async (userId) => {
  const goals = await Goal.find({ 
    user: userId, 
    isPrivate : false
  }).sort({ startDate: 1 });
  return goals;
}

//update goal by goalId 
exports.updateGoalById = async (goalId, fields, session = null) => {
  const goal = await Goal.findByIdAndUpdate(
    goalId,
    { $set: fields },
    { new: true, session: session}
  );
  return goal;
}

//update compId on goals
exports.updateCompIdOnGoals = async (compId, session = null) => {
  await Goal.updateMany(
    { compId: compId }, 
    { compId: null },
    { session: session }
  );
}

//update goals by userId
exports.updateGoalsByUserId = async (userId, goalFields, session = null) => {
  await Goal.findOneAndUpdate(
    { user: userId },
    { $set: goalFields },
    { session: session }
  );
}

//update goals by compId
exports.updateGoalsByCompId = async (compId, goalFields, session = null) => {
  await Goal.updateMany(
    { compId: compId },
    { $set: goalFields }, 
    { session: session }
  )
}

//update goals by userId and extend tracker
exports.updateGoalsByUserIdAndAppendTracker = async (userId, goalFields, array, session = null) => {
  await Goal.findOneAndUpdate(
    { user: userId },
    { $set: goalFields, $push: { tracker: array} },
    { session: session }
  );
}

//update goals by compId and extend tracker
exports.updateGoalsByCompIdAndAppendTracker = async (compId, goalFields, array, session = null) => {
  await Goal.updateMany(
    { compId: compId },
    { $set: goalFields, $push: { tracker: array} }, 
    { session: session }
  )
}

exports.updateGoalsByUserIdAndTrimTracker = async (userId, goalFields, duration, session = null) => {
  await Goal.findOneAndUpdate(
    { user: userId },
    { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}},
    { session: session }
  );
}

//update goals by compId and extend tracker
exports.updateGoalsByCompIdAndTrimTracker = async (compId, goalFields, newDuration, session = null) => {
  await Goal.updateMany(
    { compId: compId },
    { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}}, 
    { session: session }
  )
}

//remove goal from competition
exports.removeGoalFromCompetition = async (compId, userId, session = null) => {
  await Goal.findOneAndUpdate(
    { compId: compId, user: userId },
    { $set: { compId: null }},
    { session: session }
  );
}

//delete goal by goalId
exports.deleteGoalById = async (goalId) => {
  await Goal.findByIdAndDelete(goalId);
}

//delete goal by userId
exports.deleteGoalByUserId = async (userId, session = null) => {
  await Goal.findOneAndDelete(
    { user: userId },
    { session: session }
  );
}

//delete many goals by userId
exports.deleteAllUserGoals = async (userId, session = null) => {
  await Goal.deleteMany(
    { user: userId }, 
    { session: session}
  );
}