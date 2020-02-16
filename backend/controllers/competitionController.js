const Competition = require('../models/Competitions');
const Goal = require('../models/Goals');
const User = require('../models/Users');
const { validateGoalRequest } = require('./validation');
const { createTracker, updateTracker } = require('./goalFunctions');
const mongoose = require('mongoose');

const getCompetition = async(req, res) => {
  try {
    const competition = await Competition.findById(req.params.compid);
    if (!competition)
      return res.status(404).json({msg: 'Competition not found.'});
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const getCompetitionGoalsByCompId = async(req, res) => {
  try {
    const goals = await Goal.find({ compId: req.params.compid });
    if (!goals)
      return res.status(404).json({msg: 'Competition has no goals.'});
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const getCompetitionParticipants = async(req, res) => {
  try {
    //get user ids
    const userIdObject = await Competition.findById(req.params.compid).select('userIds -_id');

    //destructure returned object
    const { userIds } = userIdObject;

    //get user attributes
    const participants = await User.find({ _id: { $in: userIds }}).select('_id firstName alias');

    //return participants
    res.json(participants);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const createCompetitionByGoalId = async (req, res) => {
  try {
    //verify goal exists
    let goal = await Goal.findById(req.params.goalid).select('-_id');
    if (!goal)
      return res.status(404).json({msg: 'Goal does not exist.'})

    const { user, name, duration, startDate, type, units, total, isPrivate, tracker} = goal;

    //start session for many DB updates
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //create competition
      const competition = new Competition({
        goalId: req.params.goalid,
        userIds: [req.user.id],
        adminIds: [req.user.id]
      });
      await competition.save({ session: ses1 });

      //modify goal to include compId
      goal = await Goal.findByIdAndUpdate(
        req.params.goalid, 
        { $set: {user: competition._id} },
        { new: true, session: ses1 },
      );

      //if type is difference, change start value to 0 
      if (type === 'difference')
        tracker[0] === 0;

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

      await newGoal.save({ session: ses1 });

    await ses1.commitTransaction();

    res.json(competition);
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error.' });
  }
}

const deleteCompetition = async(req, res) => {
  try {
    const competition = await Competition.findById(req.params.compid);

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(401).json({msg: 'Only admin can delete competition.'});
  
    //start session for many DB updates
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //delete competition
      await Competition.findByIdAndDelete(
        req.params.compid, 
        { session: ses1 }
      );
    
      //delete template goal
      await Goal.findOneAndDelete(
        { user: req.params.compid },
        { session: ses1 }
      );

      //change compId of competition goals to null
      await Goal.updateMany(
        { compId: req.params.compid }, 
        { compId: null },
        { session: ses1 }
      );
  
      //TODO send invite telling competition has been deleted

    await ses1.commitTransaction();

    res.json({ msg: 'Competition deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const updateCompetition = async(req, res) => {
  try {
    //#region temp
    const { goal: { name, duration, startDate, type, units, total, isPrivate, tracker, initialValue }} = req.body;

    //verify template goal exists
    let goal = await Goal.findOne({ user: req.params.compid });
    if(!goal)
      return res.status(404).json({ msg: 'Competition goal not found.' });

    //verify competition exists
    let competition = await Competition.findById(req.params.compid);
    if(!competition)
      return res.status(404).json({ msg: 'Competition not found.' });

    //verify user is admin
    if (!competition.adminIds.includes(req.user.id)) 
      return res.status(401).json({ msg: 'Only admins can modify competitions.' });
    
    //check request for errors
    const msg = validateGoalRequest({ name, duration, startDate, type, total });
    if (msg) {
      return res.status(422).json({ msg: msg });
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
    
    //#endregion temp

    //update tracker
    let newTracker = [];

    //update trackers
    if (goal.type !== type) {
      //no need to preserve trackers, so simply overwrite
      //note that type cannot change after competition has begun, so this also verifies competition has not started
      newTracker = createTracker(newDuration, total, type, initialValue);

      goalFields.tracker = newTracker;

      const ses1 = await mongoose.startSession();
        ses1.startTransaction();

        //update template goal
        await Goal.findOneAndUpdate(
          { user: req.params.compid },
          { $set: goalFields },
          { session: ses1 }
        );
        //update user goals
        await Goal.updateMany(
          { compId: req.params.compid },
          { $set: goalFields }, 
          { session: ses1 }
        )

      await ses1.commitTransaction();
    } else {
      //need to preserve data in trackers

      //get updated tracker length
      let length = newDuration - tracker.length;
      if (type === 'pass/fail') {
        length = newDuration / 7 * total - tracker.length;
      } else if (type === 'duration') {
        length = newDuration + 1 - tracker.length;
      }

      const ses1 = await mongoose.startSession();
        ses1.startTransaction();

        if (length === 0) {
          //update template goal
          await Goal.findOneAndUpdate(
            { user: req.params.compid },
            { $set: goalFields },
            { session: ses1 }
          );
          //update user goals
          await Goal.updateMany(
            { compId: req.params.compid },
            { $set: goalFields },
            { session: ses1 }
          )
        }
        //update goals and append trackers
        else if (length > 0) {
          let appendArray = (type === 'total' ? 
            new Array(length).fill(0) : 
            new Array(length).fill(null)
          );
          //update template goal
          await Goal.findOneAndUpdate(
            { user: req.params.compid },
            { $set: goalFields, $push: { tracker: appendArray }},
            { session: ses1 }
          );
          //update user goals
          await Goal.updateMany(
            { compId: req.params.compid },
            { $set: goalFields, $push: { tracker: appendArray }},
            { session: ses1 }
          )
        }
        //update goals and trim trackers
        else if (length < 0) {
          //update template goal
          await Goal.findOneAndUpdate(
            { user: req.params.compid },
            { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}}, 
            { new: true, session: ses1 }
          );
          //update user goals
          await Goal.updateMany(
            { compId: req.params.compid },
            { $set: goalFields, $push: { tracker: { $each: [ ], $slice: newDuration }}},
            { session: ses1 }
          )
        }
      
      await ses1.commitTransaction();
    }

    res.json(competition)
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error.' });
  }
}

const addUserToCompetition = async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.compid);    

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify user not already in competition
    if(competition.userIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is already in competition.'})

    //get template goal
    const goal = await Goal.findOne({ user: req.params.compid });
    if(!goal)
      return res.status(404).json({msg: 'Competition goal not found.'})
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
      compId: req.params.compid,
      tracker
    });

    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      await newGoal.save({ session: ses1 });

      //add user id to userIds array
      competition = await Competition.findByIdAndUpdate(
        req.params.compid,
        { $addToSet: { 'userIds': req.user.id }},
        { new: true, session: ses1 }
      );

    await ses1.commitTransaction();

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const removeUserFromCompetition = async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.compid);    

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify user in competition
    if(!competition.userIds.includes(req.user.id))
      return res.status(404).json({msg: 'User is not in competition.'})

    //verify user is not admin
    if(competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is an admin. Remove user from admin array before removing as user.'})

    const ses1 = await mongoose.startSession();
      ses1.startTransaction();
      //reset user goal so it is not part of competition
      await Goal.findOneAndUpdate(
        { compId: req.params.compid, user: req.user.id },
        { $set: { compId: null }},
        { session: ses1 }
      );

      //remove user id from userIds array
      await Competition.findByIdAndUpdate(
        req.params.compid,
        { $pull: { 'userIds': req.user.id }},
        { session: ses1 }
      );
    await ses1.commitTransaction();

    res.json({msg: 'User removed from competition.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const kickUserFromCompetition = async(req, res) => {
  try {
    const { kickeeId } = req.body;

    let competition = await Competition.findById(req.params.compid);    

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify kickee in competition
    if(!competition.userIds.includes(kickeeId))
      return res.status(404).json({msg: 'User is not in competition.'})

    //verify kickee is not admin
    if(competition.adminIds.includes(kickeeId))
      return res.status(401).json({msg: 'User is an admin. Admins cannot be kicked from a competition.'});

    //verify kicker is admin
    if(!competition.adminIds.includes(req.user.id))
      return res.status(401).json({msg: 'You are not an admin. Only admins can kick a competition participant.'})

    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //reset user goal so it is not part of competition
      await Goal.findOneAndUpdate(
        { compId: req.params.compid, user: kickeeId },
        { $set: { compId: null }},
        { session: ses1 }
      );

      //remove user id from userIds array
      competition = await Competition.findByIdAndUpdate(
        req.params.compid,
        { $pull: { 'userIds': kickeeId }},
        { new: true, session: ses1 }
      );
    await ses1.commitTransaction();

    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const addAdminToCompetition = async(req, res) => {
  try {
    const {newAdminId} = req.body;

    let competition = await Competition.findById(req.params.compid);

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify user not already admin
    if(competition.adminIds.includes(newAdminId))
      return res.status(400).json({msg: 'User is already admin.'})

    //verify user is a part of competition
    if(!competition.userIds.includes(newAdminId))
      return res.status(404).json({msg: 'User must be a participant in competition before they can be an admin.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(401).json({msg: 'Only admin can add another admin.'});

    //add admin to adminIds
    competition = await Competition.findByIdAndUpdate(
      req.params.compid,
      { $addToSet: { 'adminIds': newAdminId }},
      { new: true }
    );

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const removeAdminFromCompetition = async(req, res) => {
  try {
    let competition = await Competition.findById(req.params.compid);

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(401).json({msg: 'You are not an admin.'});

    //verify user is not last admin
    if (competition.adminIds.length === 1)
      return res.status(400).json({msg: 'You must appoint another user to be the admin for this competition before you can relinquish your role.'});

    //remove admin from adminIds
    competition = await Competition.findByIdAndUpdate(
      req.params.compid,
      { $pull: { 'adminIds': req.user.id }},
      { new: true }
    );

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getCompetition = getCompetition;
exports.getCompetitionGoalsByCompId = getCompetitionGoalsByCompId;
exports.getCompetitionParticipants = getCompetitionParticipants;
exports.createCompetitionByGoalId = createCompetitionByGoalId;
exports.deleteCompetition = deleteCompetition;
exports.updateCompetition = updateCompetition;
exports.addUserToCompetition = addUserToCompetition;
exports.removeUserFromCompetition = removeUserFromCompetition;
exports.kickUserFromCompetition = kickUserFromCompetition;
exports.addAdminToCompetition = addAdminToCompetition;
exports.removeAdminFromCompetition = removeAdminFromCompetition;