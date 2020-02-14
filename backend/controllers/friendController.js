const User = require('../models/Users');
const Goal = require('../models/Goals');
const mongoose = require('mongoose')

const getUserFriends = async (req, res) => {
  try {
    //get user friends array - array of ids
    const idArray = await User.findById(req.user.id).select('friends -_id');

    //get array of user items from friends array
    const friendArray = await User.find({ _id: { $in: idArray.friends }}).select('firstName lastName email alias _id ');
    res.json(friendArray);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const addFriend = async (req, res) => {
  //verify user not adding themselves
  if (req.params.userid === req.user.id)
    return res.json({msg: 'You cannot add yourself as a friend!'})
    
  try {
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();
      const friend = await User.findByIdAndUpdate(
        req.params.userid,
        { $addToSet: { 'friends': req.user.id }},
        { new: true },
        { session: ses1 }
      ).select('firstName lastName email alias _id ');

      await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { 'friends': req.params.userid }},
        { new: true }, 
        { session: ses1 }
    );

    await ses1.commitTransaction();

    res.json(friend);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const deleteFriend = async (req, res) => {
  //verify user not deleting themselves
  if (req.params.userid === req.user.id)
    return res.json({msg: 'You cannot delete yourself as a friend!'})
  
  try {

    const ses1 = await mongoose.startSession();
      ses1.startTransaction();
      await User.findByIdAndUpdate(
        req.params.userid,
        { $pull: { 'friends': req.user.id }},
        { session: ses1 }
      );

      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { 'friends': req.params.userid }},
        { session: ses1 }
      ).select('firstName lastName email alias _id ');

    ses1.commitTransaction();
    
    res.json({msg: 'Friend deleted!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const getFriendGoals = async (req, res) => {
  //verify user is friends with :id
  const idArray = await User.findById(req.user.id).select('friends -_id');
  if (!idArray.friends.includes(req.params.userid))
    return res.json({msg: 'Check: You are not friends with this user!'})

    try {
    //only get goals with isPrivate set to false
    const goals = await Goal.find({ 
      user: req.params.userid, 
      isPrivate : false
    }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const getFriendFriends = async (req, res) => {
  try {
    //verify user is friends with :id
    const idArray = await User.findById(req.params.userid).select('friends -_id');
    if (!idArray.friends.includes(req.user.id))
      return res.json({msg: 'You are not friends with this user!'})

    //only get friends who are mutual or searchable
    const friendArray = await User.find({ 
      $and : [
        {_id: { $in: idArray.friends }}, 
        {_id: { $ne: req.user.id }}
      ],
      $or: [
        { isSearchable: true },
        { friends: { $in: req.user.id}}
      ]
    }).select('firstName lastName email alias _id ');

    res.json(friendArray);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getUserFriends = getUserFriends;
exports.addFriend = addFriend;
exports.deleteFriend = deleteFriend;
exports.getFriendGoals = getFriendGoals;
exports.getFriendFriends = getFriendFriends;