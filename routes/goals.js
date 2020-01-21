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

  const { name, duration, startDate, type, units, total, compId, privacy } = req.body;
  
  try {
    const goal = new Goal({ 
      user: req.user.id, 
      name, 
      duration, 
      startDate, 
      type, 
      units,
      total,
      privacy, 
      compId, 
      tracker: new Array()
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
  const { name, duration, startDate, type, units, total, privacy } = req.body;
  
  //check request for errors
  const msg = validateRequest(req.body);
  if (msg) res.status(400).json({ msg: msg });

  const goalFields = {};
  if(name) goalFields.name = name;
  if(duration) goalFields.duration = duration;
  if(startDate) goalFields.startDate = startDate;
  if(type) goalFields.type = type;
  if(units) goalFields.units = units;
  if(total) goalFields.total = total;
  if(privacy) goalFields.privacy = privacy;

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

//delete all goals for user - will be paired with deleting user
//GET api/goals/user/:id (user id)
//Private route
router.delete('/user/:id', auth, async (req, res) => {
  try {
    //verify current user sent request
    if(req.params.id !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //verify user has goals
    let goal = await Goal.find({ user: req.user.id });
    if(goal.length === 0) return res.status(404).json({ msg: 'No goals were found for user.'});

    //delete goals
    await Goal.deleteMany({ user: req.params.id });
    res.json({ msg: 'Goals deleted.'});
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