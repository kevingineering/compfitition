const User = require('../models/Users');

//add user
exports.addNewUser = async (userFields) => {
  const newUser = new User(userFields)
  await newUser.save();
  return newUser;
}

//get user by userId
exports.getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
}

//get user by userId
exports.getUserByIdWithPassword = async (userId) => {
  const user = await User.findById(userId);
  return user;
}

//get user by property
exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
}

//get array of userIds
exports.getUsersInArray = async (idArray, selectString) => {
  const users = await User.find(
    { _id: { $in: idArray }}
  ).select(selectString);
  return users;
}

//get searchable users who are not user
exports.getSearchableUsers = async (userId) => {
  const users = await User.find(
    { isSearchable: true, _id: { $ne: userId }}
  ).select('_id firstName lastName email');
  return users;
}

//get friend's friends who are mutual or searchable
exports.getFriendFriends = async (userId, array) => {
  const friendArray = await User.find({ 
    $and : [
      {_id: { $in: array }}, 
      {_id: { $ne: userId }}
    ],
    $or: [
      { isSearchable: true },
      { friends: { $in: userId }}
    ]
  }).select('firstName lastName email alias _id ');
  return friendArray;
}

//update user by userId
exports.updateUserById = async (userId, userFields) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: userFields },
    { new: true }
  );
  return user;
}

//add friend to user
exports.addFriendToUser = async (userId1, userId2, session = null) => {
  const friend = await User.findByIdAndUpdate(
    userId1,
    { $addToSet: { friends: userId2 }},
    { new: true, session: session }
  ).select('firstName lastName email alias _id ');
  return friend;
}
  
// //remove friend from user
exports.removeFriendFromUser = async (userId1, userId2, session) => {
  const friend = await User.findByIdAndUpdate(
    userId1,
    { $pull: { friends: userId2 }},
    { new: true, session: session }
  ).select('firstName lastName email alias _id ');
  return friend;
}

//delete user by userId
exports.deleteUserById = async (userId, session = null) => {
  await User.findByIdAndDelete(userId, {session: session});
}