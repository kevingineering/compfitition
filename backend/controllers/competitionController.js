const mongoose = require('mongoose');
const { validateGoalRequest } = require('./validation');
const { createTracker } = require('./goalFunctions');
const competitionService = require('../services/competition');
const goalService = require('../services/goal');
const userService = require('../services/user');
const letterService = require('../services/letter');

exports.getCompetition = async(req, res) => {
  try {
    const competition = await competitionService.getCompetitionById(req.params.compId);
    if (!competition)
      return res.status(404).json({msg: 'Competition not found.'});
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getCompetitionGoals = async(req, res) => {
  try {
    const goals = await goalService.getGoalsByCompId(req.params.compId);
    if (!goals)
      return res.status(404).json({msg: 'Competition has no goals.'});
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getCompetitionParticipants = async(req, res) => {
  try {
    //get userIds
    const competition = await competitionService.getCompetitionById(req.params.compId);

    //destructure returned object
    const { userIds } = competition;

    //get user attributes
    const participants = await userService.getUsersInArray(userIds, '_id firstName alias');

    //return participants
    res.json(participants);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getCompetitionInvitees = async (req, res) => {
  try {
    //get competition letters
    const letters = await letterService.getLettersByCompId(req.params.compId)
    if(!letters)
      return null
    
    //filter out invites from letters
    invites = letters.filter(letter => letter.type === 'toUser')
    if(!invites)
      return null

    //get ids from invites
    const idArray = invites.map(invite => invite.userId)

    //get users
    const users = await userService.getUsersInArray(idArray, '_id firstName lastName')
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.createCompetitionByGoalId = async (req, res) => {
  try {
    //verify goal exists
    let goal = await goalService.getGoalById(req.params.goalId)
    if (!goal)
      return res.status(404).json({msg: 'Goal does not exist.'})

    const { user, name, duration, startDate, type, description, units, total, isPrivate, tracker} = goal;

    //start session for many DB updates
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //create competition
      const compFields = {
        goalId: req.params.goalId,
        userIds: [req.user.id],
        adminIds: [req.user.id]
      };
      const competition = await competitionService.addNewCompetition(compFields, ses1);

      //modify goal to include compId
      goal = await goalService.updateGoalById(
        req.params.goalId, 
        {user: competition._id}, ses1);

      //if type is difference, change start value to 0 
      if (type === 'difference')
        tracker[0] === 0;

      //duplicate goal as competition template
      const newGoal = {
        user,
        name, 
        duration, 
        startDate, 
        type, 
        description,
        units,
        total,
        isPrivate, 
        compId: competition._id,
        tracker
      };

      await goalService.addNewGoal(newGoal, ses1);

    await ses1.commitTransaction();

    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.deleteCompetition = async(req, res) => {
  try {
    const competition = await competitionService.getCompetitionById(req.params.compId);

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //get template goal 
    let goal = (await goalService.getGoalsByUserId(req.params.compId))

    goal = goal[0]

    //verify template goal found
    if(!goal)
      return res.status(404).json({msg: 'Competition goal not found.'})

    //verify admin
    if (!competition.adminIds.includes(req.user.id))
      return res.status(401).json({msg: 'Only admin can delete competition.'});
  
    //start session for many DB updates
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //delete competition
      await competitionService.deleteCompetitionById(req.params.compId, ses1)
      
      //delete template goal
      await goalService.deleteGoalByUserId(req.params.compId, ses1)

      //change compId of competition goals to null
      await goalService.updateCompIdOnGoals(req.params.compId, ses1)

      //delete current competition letters
      await letterService.deleteAllCompetitionLetters(req.params.compId, ses1)

      //send letters telling users competition has been deleted
      await letterService.addCompDeletedLetters(competition.userIds, req.params.compId, goal.name, ses1)

    await ses1.commitTransaction();

    res.json({ msg: 'Competition deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.updateCompetition = async(req, res) => {
  try {
    //#region temp
    const { goal: { name, duration, startDate, type, description, units, total, isPrivate, tracker, initialValue }} = req.body;

    //verify template goal exists
    let goal = await goalService.getGoalsByUserId(req.params.compId);

    goal = goal[0];

    if(!goal)
      return res.status(404).json({ msg: 'Competition goal not found.' });

    //verify competition exists
    let competition = await competitionService.getCompetitionById(req.params.compId);
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
    if(description || description === '') goalFields.description = description;
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
        await goalService.updateGoalsByUserId(req.params.compId, goalFields, ses1);

        //update user goals
        await goalService.updateGoalsByCompId(req.params.compId, goalFields, ses1);

        //update letter expiration dates
        if (startDate !== goal.startDate) {
          await letterService.updateLetterExpirationDate(req.params.compId, startDate, ses1)
        }

      await ses1.commitTransaction();
    } else {
      //need to preserve data in trackers

      //get updated tracker length
      let length = newDuration - tracker.length;
      if (type === 'pass/fail') {
        length = newDuration / 7 * total - tracker.length;
      } else if (type === 'difference') {
        length = newDuration + 1 - tracker.length;
        newDuration += 1;
      }

      const ses1 = await mongoose.startSession();
        ses1.startTransaction();

        if (length === 0) {
          //update template goal
          await goalService.updateGoalsByUserId(req.params.compId, goalFields, ses1);

          //update user goals
          await goalService.updateGoalsByCompId(req.params.compId, goalFields, ses1);

          //update letter expiration dates
          if (startDate !== goal.startDate) {
            await letterService.updateLetterExpirationDate(req.params.compId, startDate, ses1)
          }
        }
        //update goals and append trackers
        else if (length > 0) {
          let appendArray = (type === 'total' ? 
            new Array(length).fill(0) : 
            new Array(length).fill(null)
          );

          //update template goal
          await goalService.updateGoalsByUserIdAndAppendTracker(req.params.compId, goalFields, appendArray, ses1);

          //update user goals
          await goalService.updateGoalsByCompIdAndAppendTracker(req.params.compId, goalFields, appendArray, ses1);

          //update letter expiration dates
          if (startDate !== goal.startDate) {
            await letterService.updateLetterExpirationDate(req.params.compId, startDate, ses1)
          }
        }
        //update goals and trim trackers
        else if (length < 0) {
          //update template goal
          await goalService.updateGoalsByUserIdAndTrimTracker(req.params.compId, goalFields, newDuration, ses1);

          //update user goals
          await goalService.updateGoalsByCompIdAndTrimTracker(req.params.compId, goalFields, newDuration, ses1);

          //update letter expiration dates
          if (startDate !== goal.startDate) {
            await letterService.updateLetterExpirationDate(req.params.compId, startDate, ses1)
          }
        }
    
      await ses1.commitTransaction();
    }
    res.json(competition)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.addUserToCompetition = async(req, res) => {
  try {
    let letter = await letterService.getLetterById(req.params.letterId)

    //verify letter exists
    if(!letter)
      return res.status(404).json({msg: 'Letter does not exist.'})

    let competition = await competitionService.getCompetitionById(letter.compId);    

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify user not already in competition
    if(competition.userIds.includes(letter.userId))
      return res.status(400).json({msg: 'User is already in competition.'})

    //get template goal
    let goal = await goalService.getGoalsByUserId(letter.compId);

    goal = goal[0]

    if(!goal)
      return res.status(404).json({msg: 'Competition goal not found.'})

    const { name, duration, startDate, type, description, units, total, isPrivate, tracker } = goal;

    //create goal for user from template goal
    const goalFields = {
      user: letter.userId,
      name, 
      duration, 
      startDate, 
      type, 
      description,
      units,
      total,
      isPrivate, 
      compId: letter.compId,
      tracker
    };

    //add user goal, add userId to Competition.userIds array, and delete letter
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      goal = await goalService.addNewGoal(goalFields, ses1);
      competition = await competitionService.addUserToCompetition(letter.compId, letter.userId, ses1)
      await letterService.deleteLetterById(req.params.letterId, ses1)

    await ses1.commitTransaction();

    //return competition
    res.json({competition, goal});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.removeUserFromCompetition = async(req, res) => {
  try {
    let competition = await competitionService.getCompetitionById(req.params.compId);    

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
      await goalService.removeGoalFromCompetition(req.params.compId, req.user.id, ses1)

      //remove userId from userIds array
      await competitionService.removeUserFromCompetition(req.params.compId, req.user.id, ses1);

    await ses1.commitTransaction();

    res.json({msg: 'User removed from competition.'});
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.kickUserFromCompetition = async(req, res) => {
  try {
    const { kickeeId } = req.body;

    let competition = await competitionService.getCompetitionById(req.params.compId);    

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

    let goal = await goalService.getGoalsByUserId(req.params.compId)

    goal = goal[0]

    if(!goal)
      return res.status(401).json({msg: 'Competition goal not found.'})

    let letterFields = {
      compId: req.params.compId,
      message: `You have been removed from ${goal.name}. The competition goal has been saved as a personal goal.`,
      userId: kickeeId,
      type: 'userKicked'
    }

    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //reset user goal so it is not part of competition
      await goalService.removeGoalFromCompetition(req.params.compId, kickeeId, ses1)

      //remove userId from userIds array
      competition = await competitionService.removeUserFromCompetition(req.params.compId, kickeeId, ses1)

      //delete letters to user
      await letterService.deleteUserLettersForComp(kickeeId, req.params.compId, ses1)

      //add letter telling them they were deleted
      await letterService.addNewLetter(letterFields, ses1)

    await ses1.commitTransaction();

    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.addAdminToCompetition = async(req, res) => {
  try {
    let letter = await letterService.getLetterById(req.params.letterId)

    //verify letter exists
    if(!letter)
      return res.status(404).json({msg: 'Letter does not exist.'})

    let competition = await competitionService.getCompetitionById(letter.compId);

    //verify competition exists
    if(!competition)
      return res.status(404).json({msg: 'Competition does not exist.'})

    //verify user not already admin
    if(competition.adminIds.includes(req.user.id))
      return res.status(400).json({msg: 'User is already admin.'})

    //verify user is a part of competition
    if(!competition.userIds.includes(req.user.id))
      return res.status(404).json({msg: 'User must be a participant in competition before they can be an admin.'})

    //add user goal, add userId to Competition.userIds array, and delete letter
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      competition = await competitionService.addAdminToCompetition(letter.compId, req.user.id, ses1)
      await letterService.deleteLetterById(req.params.letterId, ses1)

    await ses1.commitTransaction();
    
    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.removeAdminFromCompetition = async(req, res) => {
  try {
    let competition = await competitionService.getCompetitionById(req.params.compId);

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
    competition = await competitionService.removeAdminFromCompetition(req.params.compId, req.user.id);

    //return competition
    res.json(competition);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getCompetitionCurrentGoal = async (req, res) => {
  try {
    const goal = await goalService.getGoalByCompIdAndUserId(req.params.compId, req.params.userId);
    
    //verify goal exists
    if (!goal)
      return res.json({msg: 'Goal not found!'})

    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}