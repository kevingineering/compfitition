const Goal = require('../models/Goals');

//add new goal
exports.addNewGoal = async (goalFields, session = null) => {
  try {
    const goal = new Goal(goalFields);
    await goal.save({session: session});
    return goal;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get goal by goal id
exports.getGoalById = async (id) => {
  try {
    const goal = await Goal.findById(id);
    return goal;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get goals by user id
exports.getGoalsByUserId = async (id) => {
  try {
    const goals = await Goal.find({ user: id }).sort({ startDate: 1 });
    return goals;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get goals by comp id
exports.getGoalsByCompId = async (id) => {
  try {
    const goals = await Goal.find({ compId: id }).sort({ startDate: 1 });
    return goals;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get friend goals that are not private
exports.getFriendGoals = async (id) => {
  try {
    const goals = await Goal.find({ 
      user: id, 
      isPrivate : false
    }).sort({ startDate: 1 });
    return goals;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goal by goal id 
exports.updateGoalById = async (id, fields, session = null) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      id,
      { $set: fields },
      { new: true, session: session}
    );
    return goal;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update comp id on goals
exports.updateCompIdOnGoals = async (id, session = null) => {
  try {
    await Goal.updateMany(
      { compId: id }, 
      { compId: null },
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goals by user id
exports.updateGoalsByUserId = async (id, goalFields, session = null) => {
  try {
    await Goal.findOneAndUpdate(
      { user: id },
      { $set: goalFields },
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goals by comp id
exports.updateGoalsByCompId = async (id, goalFields, session = null) => {
try {
    await Goal.updateMany(
      { compId: id },
      { $set: goalFields }, 
      { session: session }
    )
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goals by user id and extend tracker
exports.updateGoalsByUserIdAndAppendTracker = async (id, goalFields, array, session = null) => {
  try {
    await Goal.findOneAndUpdate(
      { user: id },
      { $set: goalFields, $push: { tracker: array} },
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goals by comp id and extend tracker
exports.updateGoalsByCompIdAndAppendTracker = async (id, goalFields, array, session = null) => {
try {
    await Goal.updateMany(
      { compId: id },
      { $set: goalFields, $push: { tracker: array} }, 
      { session: session }
    )
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.updateGoalsByUserIdAndTrimTracker = async (id, goalFields, duration, session = null) => {
  try {
    await Goal.findOneAndUpdate(
      { user: id },
      { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}},
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update goals by comp id and extend tracker
exports.updateGoalsByCompIdAndTrimTracker = async (id, goalFields, duration, session = null) => {
try {
    await Goal.updateMany(
      { compId: id },
      { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}}, 
      { session: session }
    )
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//remove goal from competition
exports.removeGoalFromCompetition = async (compId, userId, session = null) => {
  try {
    await Goal.findOneAndUpdate(
      { compId: compId, user: userId },
      { $set: { compId: null }},
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete goal by goal id
exports.deleteGoalById = async (id) => {
  try {
    await Goal.findByIdAndDelete(id);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete goal by user id
exports.deleteGoalByUserId = async (id, session = null) => {
  try {
    await Goal.findOneAndDelete(
      { user: id },
      { session: session }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete many goals by user id
exports.deleteAllUserGoals = async (id, session = null) => {
  try {
    await Goal.deleteMany(
      { user: id }, 
      { session: session}
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}