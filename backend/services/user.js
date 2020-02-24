const User = require('../models/Users');

//add user
exports.addNewUser = async (userFields) => {
  try {
    const newUser = new User(userFields)
    await newUser.save();
    return newUser;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get user by id
exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password');
    return user;
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get user by id
exports.getUserByIdWithPassword = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get user by property
exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get users in array of ids
exports.getUsersInArray = async (idArray, selectString) => {
  try {
    const users = await User.find({ _id: { $in: idArray }}).select(selectString);
    return users;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get searchable users
exports.getSearchableUsers = async (id) => {
  try {
    const users = await User.find(
      { isSearchable: true, _id: { $ne: id }}
    ).select('_id firstName lastName email');

    return users;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get friend's friends who are mutual or searchable
exports.getFriendFriends = async (id, array) => {
  try {
    const friendArray = await User.find({ 
      $and : [
        {_id: { $in: array }}, 
        {_id: { $ne: id }}
      ],
      $or: [
        { isSearchable: true },
        { friends: { $in: id }}
      ]
    }).select('firstName lastName email alias _id ');

    return friendArray;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//update user by id
exports.updateUserById = async (id, userFields) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: userFields },
      { new: true }
    );
    return user;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//add friend to user
exports.addFriendToUser = async (id1, id2, session = null) => {
  try {
    const friend = await User.findByIdAndUpdate(
      id1,
      { $addToSet: { 'friends': id2 }},
      { new: true, session: session }
    ).select('firstName lastName email alias _id ');
    
    return friend;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}
  
// //remove friend from user
exports.removeFriendFromUser = async (id1, id2, session = null) => {
  try {
    const friend = await User.findByIdAndUpdate(
      id1,
      { $pull: { 'friends': id2 }},
      { new: true, session: session }
    ).select('firstName lastName email alias _id ');
    
    return friend;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete user by id
exports.deleteUserById = async (id, session = null) => {
  try {
    await User.findByIdAndDelete(id, {session: session});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}