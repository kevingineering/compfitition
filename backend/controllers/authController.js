const User = require('../models/Users');
const Goal = require('../models/Goals');
const Request = require('../models/Requests');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
const mongoose = require('mongoose');

const getUser = async (req, res, next) => {
  try {
    //finds user but does not return password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //verify email exists
    let user = await User.findOne({ email });
    if(!user) 
      return res.status(404).json({ msg: 'No account exists for input email.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) 
      return res.status(422).json({msg: 'Password is incorrect.'});

    //create payload - limits token so it only works for one user
    const payload = {
      user: {
        id: user.id
      }
    }

    //create jwt - takes payload, secret, options, and callback function (that returns token)
    jwt.sign( payload, config.get('jwtSecret'), { expiresIn: 3600 }, 
      (err, token) => {
        if(err) throw err;
        res.json({ token })
      }
    )  
  } catch {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const validateLoginRequest = [
  check('email', 'Please enter your email.').isEmail(),
  check('password', 'Password is incorrect.').isLength({ min: 8 })
]

const updateUser = async (req, res) => {
  const { firstName, lastName, alias, email, isSearchable } = req.body;

  const userFields = {};
  if(firstName) userFields.firstName = firstName;
  if(lastName) userFields.lastName = lastName;
  if(alias || alias === '') userFields.alias = alias;
  if(email) userFields.email = email;
  userFields.isSearchable = isSearchable;

  try {
    //verify current user sent request
    if(req.params.userid !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.userid  });
    if(!user) 
      return res.status(404).json({ msg: 'User not found.'});

    //ensure email has not already been used
    let test = await User.findOne({ email });
    //note that thanks to mongoose, ._id is an object, .id is a string
    if(test && test.id !== user.id) {
      return res.status(422).json({ msg: 'Another account already exists for this email.'});
    }

    //update user
    user = await User.findByIdAndUpdate(
      req.params.userid,
      { $set: userFields },
      { new: true }
    );

    res.json({user, msg: 'User updated!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const validateUpdateRequest = [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail()
]

const changeUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  try {
    //verify current user sent request
    if(req.params.userid !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.userid  });
    if(!user) 
      return res.status(404).json({ msg: 'User not found.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) 
      return res.status(401).json({msg: 'Password is incorrect.'});

    //create salt and hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    //save user
    await user.save();

    res.json({msg: 'Password changed!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const validateChangePasswordRequest = [
  check('oldPassword', 'Password is incorrect.').isLength({ min: 8 }),
  check('newPassword', 'Password must have at least eight characters.').isLength({ min: 8 })
]

const deleteUser = async (req, res) => {
  const { password } = req.body;

  try {
    //verify current user sent request
    if(req.params.userid !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.userid  });
    if(!user) 
      return res.status(404).json({ msg: 'User not found.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) 
      return res.status(401).json({msg: 'Password is incorrect.'});

    //start session for many DB updates
    const ses1 = await mongoose.startSession();
      ses1.startTransaction();

      //delete user goals
      await Goal.deleteMany(
        { user: req.params.userid }, 
        { session: ses1}
      );

      //delete user requests
      await Request.deleteMany(
        { $or: [ 
          { requester: req.params.userid} , 
          { requestee: req.params.userid } 
        ]}, 
        { session: ses1 }  
      );

      //TODO delete user from friends arrays

      //TODO delete user from competitions 

      //TODO delete user invites

      //delete user
      await User.findByIdAndDelete(
        req.params.userid, 
        { session: ses1 }
      );

    await ses1.commitTransaction();

    res.json({msg: 'User deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const getSearchableUsers = async (req, res) => {
  try {
    //finds user but does not return password
    const users = await User.find(
      { isSearchable: true, _id: { $ne: req.user.id }}
    ).select('_id firstName lastName email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getUser = getUser;
exports.loginUser = loginUser;
exports.validateLoginRequest = validateLoginRequest;
exports.updateUser = updateUser;
exports.validateUpdateRequest = validateUpdateRequest;
exports.changeUserPassword = changeUserPassword;
exports.validateChangePasswordRequest = validateChangePasswordRequest;
exports.deleteUser = deleteUser;
exports.getSearchableUsers = getSearchableUsers;