const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');
const mongoose = require('mongoose');
const userService = require('../services/user');
const goalService = require('../services/goal');
const requestService = require('../services/request');

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.registerUser = async (req, res) => {
  const { firstName, lastName, alias, email, password, searchable } = req.body;

  try {
    //check if email already used
    const checkUser = await userService.getUserByEmail(email);
    if(checkUser) return res.status(400).json({ msg: 'Account already exists for this email address.'});

    //populate user fields
    const userFields = { firstName, lastName, alias, email, password, searchable };

    //create salt and hash password
    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);
    
    //add user
    const user = await userService.addNewUser(userFields)

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
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.validateRegisterRequest = [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail(),
  check('password', 'Please enter a password with eight or more characters.').isLength({ min: 8 })
]

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //verify email exists
    let user = await userService.getUserByEmail(email);
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
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.validateLoginRequest = [
  check('email', 'Please enter your email.').isEmail(),
  check('password', 'Password is incorrect.').isLength({ min: 8 })
]

exports.updateUser = async (req, res) => {
  const { firstName, lastName, alias, email, isSearchable } = req.body;

  const userFields = {};
  if(firstName) userFields.firstName = firstName;
  if(lastName) userFields.lastName = lastName;
  if(alias || alias === '') userFields.alias = alias;
  if(email) userFields.email = email;
  userFields.isSearchable = isSearchable;

  try {
    //verify current user sent request
    if(req.params.userId !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await userService.getUserById(req.params.userId);

    if(!user) 
      return res.status(404).json({ msg: 'User not found.'});

    //ensure email has not already been used
    let test = await userService.getUserByEmail(email);

    //note that thanks to mongoose, ._id is an object, .id is a string
    if(test && test.id !== user.id) {
      return res.status(422).json({ msg: 'Another account already exists for this email.'});
    }

    //update user
    user = await userService.updateUserById(req.params.userId, userFields)

    res.json({user, msg: 'User updated!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.validateUpdateRequest = [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail()
]

exports.changeUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  try {
    //verify current user sent request
    if(req.params.userId !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await userService.getUserByIdWithPassword(req.params.userId);
    if(!user) 
      return res.status(404).json({ msg: 'User not found.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) 
      return res.status(401).json({msg: 'Password is incorrect.'});

    //create salt and hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    //update password
    await userService.updateUserById(req.user.id, {password: user.password})

    res.json({msg: 'Password changed!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.validateChangePasswordRequest = [
  check('oldPassword', 'Password is incorrect.').isLength({ min: 8 }),
  check('newPassword', 'Password must have at least eight characters.').isLength({ min: 8 })
]

exports.deleteUser = async (req, res) => {
  const { password } = req.body;

  try {
    //verify current user sent request
    if(req.params.userId !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await userService.getUserByIdWithPassword(req.params.userId);
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
      await goalService.deleteAllUserGoals(req.params.userId, ses1)

      //delete user requests
      await requestService.deleteAllUserRequests(req.params.userId, ses1)

      //TODO delete user from friends arrays

      //TODO delete user from competitions 

      //TODO delete user letters

      //delete user
      userService.deleteUserById(req.params.userId, ses1)

    await ses1.commitTransaction();

    res.json({msg: 'User deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getSearchableUsers = async (req, res) => {
  try {
    //finds user but does not return password
    const users = await userService.getSearchableUsers(req.user.id);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}