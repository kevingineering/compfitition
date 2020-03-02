const mongoose = require('mongoose');
const userService = require('../services/user');
const goalService = require('../services/goal');

exports.getUserFriends = async (req, res) => {
  try {
    //get user friends array - array of userIds
    const user = await userService.getUserById(req.user.id);

    //get array of user items from friends array
    const friendArray = await userService.getUsersInArray(user.friends, 'firstName lastName email alias _id')
    res.json(friendArray);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.addFriend = async (req, res) => {
  //verify user not adding themselves
  if (req.params.userId === req.user.id)
    return res.json({msg: 'You cannot add yourself as a friend!'})
    
  try {
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      const friend = await userService.addFriendToUser(req.user.id, req.params.userId, ses1);

      await userService.addFriendToUser(req.params.userId, req.user.id, ses1);

    await ses1.commitTransaction();

    res.json(friend);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.deleteFriend = async (req, res) => {
  //verify user not deleting themselves
  if (req.params.userId === req.user.id)
    return res.json({msg: 'You cannot delete yourself as a friend!'})
  
  try {
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      await userService.removeFriendFromUser(req.params.userId, req.user.id, ses1);

      await userService.removeFriendFromUser(req.user.id, req.params.userId, ses1);

    ses1.commitTransaction();
    
    res.json({msg: 'Friend deleted!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getFriendGoals = async (req, res) => {
  //verify users are friends
  const user = await userService.getUserById(req.user.id);
  if (!user.friends.includes(req.params.userId))
    return res.json({msg: 'Check: You are not friends with this user!'})

  try {
    //get friend goals
    const goals = await goalService.getFriendGoals(req.params.userId)
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getFriendFriends = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    
    //verify user exists
    if (!user)
      return res.json({msg: 'User does not exist!'})
      
    //verify users are friends
    if (!user.friends.includes(req.user.id))
      return res.json({msg: 'You are not friends with this user!'})

    //only get friends who are mutual or searchable
    const friendArray = await userService.getFriendFriends(req.user.id, user.friends);

    res.json(friendArray);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}