const { validateGoalRequest } = require('../controllers/validation')
const { createTracker, updateTracker } = require('./goalFunctions')
const goalService = require('../services/goal')

exports.getGoals = async(req, res) => {
  try {
    const goals = await goalService.getGoalsByUserId(req.user.id)
    res.json(goals)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.addGoal = async (req, res) => {
  //check request for errors
  const msg = validateGoalRequest(req.body)
  if (msg) 
    return res.status(422).json({ msg: msg })

  const { name, duration, startDate, type, description, units, total, isPrivate, initialValue } = req.body
  
  //fix duration if pass/fail
  let newDuration = duration
  if ( type === 'pass/fail' && duration % 7 !== 0) {
    newDuration = duration - duration % 7 + 7
  }

  //create tracker
  let tracker = createTracker(newDuration, total, type, initialValue)

  try {
    const goalFields = { 
      user: req.user.id, 
      name, 
      duration: newDuration, 
      startDate, 
      type, 
      description,
      units,
      total,
      isPrivate, 
      tracker
    }

    const goal = await goalService.addNewGoal(goalFields)
    res.json(goal)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.updateGoal = async (req, res) => {
  try {
    const { name, duration, startDate, type, description, units, total, isPrivate, tracker, initialValue } = req.body
    
    //verify goal exists
    let goal = await goalService.getGoalById(req.params.goalId)
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'})

    //ensure user owns goal
    //note that toString is necessary because saved _id is object
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'})

    //check request for errors
    const msg = validateGoalRequest(req.body)
    if (msg) res.status(422).json({ msg: msg })

    //fix duration if pass/fail
    let newDuration = duration
    if ( type === 'pass/fail' && duration % 7 !== 0) {
      newDuration = duration - duration % 7 + 7
    }

    //update tracker
    let newTracker = []
    
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
    const goalFields = {}
    if(name) goalFields.name = name
    if(newDuration) goalFields.duration = newDuration
    if(startDate) goalFields.startDate = startDate
    if(type) goalFields.type = type
    if(description || description === '') goalFields.description = description
    if(units) goalFields.units = units
    if(total) goalFields.total = total
    if(isPrivate !== undefined) goalFields.isPrivate = isPrivate
    goalFields.tracker = newTracker

    //update goal
    const newGoal = await goalService.updateGoalById(req.params.goalId, goalFields)
    res.json(newGoal)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.updateGoalTracker = async (req, res) => {
  const tracker = req.body
  try {
    //verify goal exists
    let goal = await goalService.getGoalById(req.params.goalId)

    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'})

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'})

    //update goal - new option returns the new goal (default is false and returns old goal)
    //tracker is passed in as object, so it works with $set
    const newGoal = await goalService.updateGoalById(req.params.goalId, tracker)
    res.json(newGoal)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.deleteGoal = async (req, res) => {
  try {
    //verify goal exists
    let goal = await goalService.getGoalById(req.params.goalId)
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'})

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'})

    //delete goal
    await goalService.deleteGoalById(req.params.goalId)
    res.json({ msg: 'Goal deleted.'})
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}