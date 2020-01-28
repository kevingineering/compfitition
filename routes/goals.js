const express = require('express');
const router = express.Router();
const Goal = require('../models/Goals');
const auth = require('../middleware/auth');

//get goals
//GET api/goals
//Private route
router.get('/', auth, async(req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//get public goals
//GET api/goals/public
//Public route
router.get('/public', async(req, res) => {
  try {
    const goals = await Goal.find({ privacy: 'public' }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//add goal
//POST api/goals
//Private route
router.post('/', auth, async (req, res) => {
  //check request for errors
  const msg = validateRequest(req.body);
  if (msg) res.status(400).json({ msg: msg });

  const { name, duration, startDate, type, units, total, compId, privacy, initialValue } = req.body;
  
  //fix duration if pass/fail
  let newDuration = duration;
  if ( type === 'pass/fail' && duration % 7 !== 0) {
    newDuration = duration - duration % 7 + 7;
  }

  //create tracker array
  let length = newDuration;
  if ( type === 'pass/fail') {
    length = newDuration / 7 * total;
  } 
  let tracker = new Array(length);
  if ( type === 'total') {
    tracker = tracker.fill(0);
  }
  if ( type === 'difference') {
    tracker[0] = initialValue;
  }

  try {
    const goal = new Goal({ 
      user: req.user.id, 
      name, 
      duration: newDuration, 
      startDate, 
      type, 
      units,
      total,
      privacy, 
      compId, 
      tracker
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//update goal
//PUT api/goals/:id
//Private route
router.put('/:id', auth, async (req, res) => {
  const { name, duration, startDate, type, units, total, privacy, tracker } = req.body;
  
  //check request for errors
  const msg = validateRequest(req.body);
  if (msg) res.status(400).json({ msg: msg });

  //fix duration if pass/fail
  let newDuration = duration;
  if ( type === 'pass/fail' && duration % 7 !== 0) {
    newDuration = duration - duration % 7 + 7;
  }

  //update tracker array
  let length = newDuration - tracker.length;
  if ( type === 'pass/fail') {
    length = newDuration / 7 * total - tracker.length;
  } 

  let newTracker = [];

  if (length < 0) newTracker = tracker.splice(-1*length);
  else if ( type === 'total')
    newTracker = tracker.concat(new Array(length).fill(0))
  else newTracker = tracker.concat(new Array(length));
  

  //makes object containing fields that exist - object required for $set
  const goalFields = {};
  if(name) goalFields.name = name;
  if(newDuration) goalFields.duration = newDuration;
  if(startDate) goalFields.startDate = startDate;
  if(type) goalFields.type = type;
  if(units) goalFields.units = units;
  if(total) goalFields.total = total;
  if(privacy) goalFields.privacy = privacy;
  if(tracker) goalFields.tracker = newTracker;

  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.id);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //update goal - new option returns the new goal (default is false and returns old goal)
    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true}
    );

    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//update goal tracker
//PUT api/goals/tracker/:id (goal id)
//Private route
router.put('/tracker/:id', auth, async (req, res) => {
  const tracker = req.body;
  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.id);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //update goal - new option returns the new goal (default is false and returns old goal)
    //tracker is passed in as object, so it works with $set
    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: tracker },
      { new: true}
    );

    res.json(goal);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server error.' });
  }
});

//delete goal
//DELETE api/goals/:id (goal id)
//Private route
router.delete('/:id', auth, async (req, res) => {
  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.id);
    if(!goal) 
      return res.status(404).json({ msg: 'Goal not found.'});

    //ensure user owns goal
    if(goal.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //delete goal
    await Goal.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Goal deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

const validateRequest = body => {
  const { name, duration, startDate, type, total } = body;

  if (name === '') 
    return 'Please include a name for your goal.';
  if (duration === '') 
    return 'Please include a duration (in days) for your goal.';
  if (duration < 1) 
    return 'Duration must be at least one day.';
  if (startDate < Date.now())
    return 'Start date must not be in the past.';
  if (type !== 'pass/fail' && type !== 'total' && type !== 'difference')
    return 'Please enter a valid type of goal.';
  if (typeof total !== 'number' ) {
    if (type === 'pass/fail')
      return 'Please enter how often you want to hit your goal.';
    else if (type === 'total')
      return 'Please enter a total for your goal.'
    else
      return ('Please enter the difference you would like to achieve.')
  }
};

/* NEEDS FINISHED

//get friends' goals
//GET api/goals/friends/:id
//Private route
router.get('/friends', auth, async(req, res) => {
  try {
    const goals = await Goal.find({ privacy: 'friends' || 'public' }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});
*/

module.exports = router;