const Goal = require('../models/Goals');
const { validateGoalRequest } = require('../controllers/validation');
const { createTracker, updateTracker } = require('./goalFunctions');

const getGoals = async(req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const addGoal = async (req, res) => {
  //check request for errors
  const msg = validateGoalRequest(req.body);
  if (msg) 
    return res.status(422).json({ msg: msg });

  const { name, duration, startDate, type, units, total,  isPrivate, initialValue } = req.body;
  
  //fix duration if pass/fail
  let newDuration = duration;
  if ( type === 'pass/fail' && duration % 7 !== 0) {
    newDuration = duration - duration % 7 + 7;
  }

  //create tracker
  let tracker = createTracker(newDuration, total, type);

  try {
    const goal = new Goal({ 
      user: req.user.id, 
      name, 
      duration: newDuration, 
      startDate, 
      type, 
      units,
      total,
      isPrivate, 
      tracker
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const updateGoal = async (req, res) => {
  try {
    const { name, duration, startDate, type, units, total, isPrivate, tracker, initialValue } = req.body;
    
    //verify goal exists
    let goal = await Goal.findById(req.params.goalid);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    //note that toString is necessary because saved _id is object
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //check request for errors
    const msg = validateGoalRequest(req.body);
    if (msg) res.status(422).json({ msg: msg });

    //fix duration if pass/fail
    let newDuration = duration;
    if ( type === 'pass/fail' && duration % 7 !== 0) {
      newDuration = duration - duration % 7 + 7;
    }

    //update tracker
    let newTracker = [];
    
    if (type !== goal.type) {
      //no need to preserve tracker, so simply overwrite
      //note that type cannot change after goal has begun, so this also verifies goal has not started
      newTracker = createTracker(newDuration, total, type, initialValue)
    }
    else {
      //preserve tracker information
      newTracker = updateTracker(newDuration, total, type, tracker)
    }
  
    //makes object containing fields that exist - object is required for $set
    const goalFields = {};
    if(name) goalFields.name = name;
    if(newDuration) goalFields.duration = newDuration;
    if(startDate) goalFields.startDate = startDate;
    if(type) goalFields.type = type;
    if(units) goalFields.units = units;
    if(total) goalFields.total = total;
    if(isPrivate !== undefined) goalFields.isPrivate = isPrivate;
    goalFields.tracker = newTracker;

    //update goal
    goal = await Goal.findByIdAndUpdate(
      req.params.goalid,
      { $set: goalFields },
      { new: true}
    );

    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const updateGoalTracker = async (req, res) => {
  const tracker = req.body;
  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.goalid);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //update goal - new option returns the new goal (default is false and returns old goal)
    //tracker is passed in as object, so it works with $set
    goal = await Goal.findByIdAndUpdate(
      req.params.goalid,
      { $set: tracker },
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const deleteGoal = async (req, res) => {
  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.goalid);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //delete goal
    await Goal.findByIdAndDelete(req.params.goalid);
    res.json({ msg: 'Goal deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getGoals = getGoals;
exports.addGoal = addGoal;
exports.updateGoal = updateGoal;
exports.updateGoalTracker = updateGoalTracker;
exports.deleteGoal = deleteGoal;