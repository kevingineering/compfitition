const express = require('express');
const router = express.Router();
const Competition = require('../models/Competitions');
const Goal = require('../models/Goals');
const User = require('../models/Users');
const auth = require('../middleware/auth');

// get competition
// GET api/competitions/:id (comp id)
// Private route
router.get('/:id', auth, async(req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition)
      return res.status(400).json({msg: 'Competition not found.'});
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// get competition goals for all participants
// GET api/competitions/goals/:id (comp id)
// Private route
router.get('/goals/:id', auth, async(req, res) => {
  try {
    const goals = await Goal.find({ compId: req.params.id });
    if (!goals)
      return res.status(400).json({msg: 'Competition has no goals.'});
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// get competition participants
// GET api/competitions/participants/:id (comp id)
// Private route
router.get('/participants/:id', auth, async(req, res) => {
  try {
    //get user ids
    const userIdObject = await Competition.findById(req.params.id).select('userIds -_id');

    //destructure returned object
    const { userIds } = userIdObject;

    //get user attributes
    const participants = await User.find({ _id: { $in: userIds }}).select('_id firstName alias');

    //return participants
    res.json(participants);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// create competition from goal that was just added to database
// POST api/competitions/:id (goal id)
// Private route
router.post('/:id', auth, async(req, res) => {
  try {
    const {isMax} = req.body;

    //verify goal exists
    let goal = await Goal.findById(req.params.id).select('-_id');
    if (!goal)
      return res.status(400).json({msg: 'Goal does not exist.'})

    const { user, name, duration, startDate, type, units, total, isPrivate, tracker} = goal;

    //create competition
    const competition = new Competition({
      goalId: req.params.id,
      userIds: [req.user.id],
      adminIds: [req.user.id],
      isMax
    });
    await competition.save();

    //modify goal to include compId
    goal = await Goal.findByIdAndUpdate(
      req.params.id, 
      { $set: {user: competition._id}},
      { new: true }
    );

    //duplicate goal as competition template
    const newGoal = new Goal({
      user,
      name, 
      duration, 
      startDate, 
      type, 
      units,
      total,
      isPrivate, 
      compId: competition._id,
      tracker
    });

    await newGoal.save();

    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
})

// delete competition
// DELETE api/competitions/:id (comp id)
// Private route
router.delete('/:id', auth, async(req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'Only admin can delete competition.'});
  
    //delete competition
    await Competition.findByIdAndDelete(req.params.id);
  
    //delete template goal
    await Goal.findOneAndDelete({ user: req.params.id });

    //change compId of competition goals to null
    await Goal.updateMany({ compId: req.params.id }, { compId: null });
  
    //TODO add backwards invite?

    res.json({ msg: 'Competition deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// update competition
// PUT api/competitions/:id (comp id)
// Private route
router.put('/:id', auth, async(req, res) => {
  try {
    const { goal: { name, duration, startDate, type, units, total, isPrivate, tracker }, isMax } = req.body;

    //verify template goal exists
    let goal = await Goal.findOne({ user: req.params.id });
    if(!goal)
      return res.status(404).json({ msg: 'Competition goal not found.' });

    //verify competition exists
    let competition = await Competition.findById(req.params.id);
    if(!competition)
      return res.status(400).json({ msg: 'Competition not found.' });

    //verify admin
    if (!competition.adminIds.includes(req.user.id)) 
      return res.status(400).json({ msg: 'Only admins can modify competitions.' });
    
    //check request for errors
    const msg = validateRequest({ name, duration, startDate, type, total });
    if (msg) {
      //console.log(''msg', msg);
      return res.status(400).json({ msg: msg });
    }

    //fix duration if pass/fail
    let newDuration = duration;
    if ( type === 'pass/fail' && duration % 7 !== 0) {
      newDuration = duration - duration % 7 + 7;
    }
    
    //makes object containing fields that exist - object required for $set
    const goalFields = {};
    if(name) goalFields.name = name;
    if(newDuration) goalFields.duration = newDuration;
    if(startDate) goalFields.startDate = startDate;
    if(type) goalFields.type = type;
    if(units) goalFields.units = units;
    if(total) goalFields.total = total;
    if(isPrivate !== undefined) goalFields.isPrivate = isPrivate;

    //update competition
    if(competition.isMax !== isMax)
      competition = await Competition.findByIdAndUpdate(
        req.params.id,
        { $set: {isMax: isMax} },
        { new: true }
      );

    //update tracker array
    let length = newDuration - tracker.length;
    if ( type === 'pass/fail') {
      length = newDuration / 7 * total - tracker.length;
    } else if (type === 'duration') {
      length = newDuration + 1 - tracker.length;
    }

    //tracker to be appended to existing trackers if length is greater than 0
    let appendArray;

    if (length > 0) {
      //add to trackers
      if (type === 'total')
      appendArray = new Array(length).fill(0);
      else
      appendArray = new Array(length)
    }
    
    console.log(length);
    console.log(appendArray);
    console.log(req.params.id);
    console.log(goalFields);

    //update goals but not trackers
    if (length === 0) {
      console.log('equal')
      //update template goal
      await Goal.findOneAndUpdate(
        { user: req.params.id },
        { $set: goalFields }
      );
      //update user goals
      await Goal.updateMany(
        { compId: req.params.id },
        { $set: goalFields }
      )
    }
    //update goals and append trackers
    else if (length > 0) {
      console.log('push')
      //update template goal
      await Goal.findOneAndUpdate(
        { user: req.params.id },
        { $set: goalFields, $push: { tracker: appendArray }}
      );
      //update user goals
      await Goal.updateMany(
        { compId: req.params.id },
        { $set: goalFields, $push: { tracker: appendArray }}
      )
    }
    //update goals and trim trackers
    else if (length < 0) {
      console.log('slice')
      //update template goal
      await Goal.findOneAndUpdate(
        { user: req.params.id },
        { $set: goalFields, $push: { tracker: { slice: length }}}
      );
      //update user goals
      await Goal.updateMany(
        { compId: req.params.id },
        { $set: goalFields, $push: { tracker: { slice: length }}}
      )
    }

    console.log('test');
    res.json(competition)
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// add user to competition
// PUT api/competitions/adduser/:id (comp id)
// Private route
router.put('/adduser/:id', auth, async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.id);    

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify user not already in competition
    if(competition.userIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is already in competition.'})

    //get template goal
    const goal = await Goal.findOne({ user: req.params.id });
    if(!goal)
      return res.status(400).json({msg: 'Competition goal not found.'})
    const { name, duration, startDate, type, units, total, isPrivate, tracker } = goal;

    //create goal for user from template goal
    const newGoal = new Goal({
      user: req.user.id,
      name, 
      duration, 
      startDate, 
      type, 
      units,
      total,
      isPrivate, 
      compId: req.params.id,
      tracker
    });

    await newGoal.save();

    //add user id to userIds array
    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { 'userIds': req.user.id }},
      { new: true }
    );

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// remove user from competition
// PUT api/competitions/removeuser/:id (comp id)
// Private route
router.put('/removeuser/:id', auth, async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.id);    

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify user in competition
    if(!competition.userIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is not in competition.'})

    //verify user is not admin
    if(competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is an admin. Remove user from admin array before removing as user.'})

    //reset user goal so it is not part of competition
    await Goal.findOneAndUpdate(
      { compId: req.params.id, user: req.user.id },
      {$set: { compId: null }}
    );

    //remove user id from userIds array
    await Competition.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'userIds': req.user.id }}
    );

    res.json({msg: 'User removed from competition.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// kick user from competition
// PUT api/competitions/kickuser/:id (comp id)
// Private route
router.put('/kickuser/:id', auth, async(req, res) => {
  try {
    const { kickeeId } = req.body;

    let competition = await Competition.findById(req.params.id);    

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify kickee in competition
    if(!competition.userIds.includes(kickeeId))
      return res.status(400).json({msg: 'User is not in competition.'})

    //verify kickee is not admin
    if(competition.adminIds.includes(kickeeId))
      return res.status(400).json({msg: 'User is an admin. Admins cannot be kicked from a competition.'});

    //verify kicker is admin
    if(!competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'You are not an admin. Only admins can kick a competition participant.'})

    //reset user goal so it is not part of competition
    await Goal.findOneAndUpdate(
      { compId: req.params.id, user: kickeeId },
      { $set: { compId: null }}
    );

    //remove user id from userIds array
    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'userIds': kickeeId }},
      { new: true }
    );

    res.json(competition);
  } catch (err) {
    //console.log('err)
    res.status(500).json({ msg: 'Server error.' });
  }
});

// add admin to competition
// PUT api/competitions/addadmin/:id (comp id)
// Private route
router.put('/addadmin/:id', auth, async(req, res) => {
  try {
    const {newAdminId} = req.body;

    let competition = await Competition.findById(req.params.id);

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify user not already admin
    if(competition.adminIds.includes(newAdminId))
      return res.status(400).json({msg: 'User is already admin.'})

    //verify user is a part of competition
    if(!competition.userIds.includes(newAdminId))
      return res.status(400).json({msg: 'User must be a participant in competition before they can be an admin.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'Only admin can add another admin.'});

    //add admin to adminIds
    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { 'adminIds': newAdminId }},
      { new: true }
    );

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// remove admin from competition
// PUT api/competitions/removeadmin/:id (comp id)
// Private route
router.put('/removeadmin/:id', auth, async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.id);

    //verify competition exists
    if(!competition)
      return res.status(400).json({msg: 'Competition does not exist.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'You are not an admin.'});

    //verify user is not last admin
    if (competition.adminIds.length === 1)
      return res.status(400).json({msg: 'You must appoint another user to be the admin for this competition before you can relinquish your role.'});

    //remove admin from adminIds
    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'adminIds': req.user.id }},
      { new: true }
    );

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//same as function in goals.js
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
  if (type !== 'pass/fail' && type !== 'total' && type !== 'difference') {
    //console.log('type)
    return 'Please enter a valid type of goal.';
  }
  if (typeof total !== 'number' ) {
    //console.log('total)
    if (type === 'pass/fail')
      return 'Please enter how often you want to hit your goal.';
    else if (type === 'total')
      return 'Please enter a total for your goal.'
    else
      return ('Please enter the difference you would like to achieve.')
  }
};

module.exports = router;