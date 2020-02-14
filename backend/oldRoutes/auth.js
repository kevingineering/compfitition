const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Goal = require('../models/Goals');
const Request = require('../models/Requests');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// get user data
// GET api/auth
// Private route
router.get('/', auth, async (req, res) => {
  try {
    //finds user but does not return password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// log in user and get token
// POST api/auth
// Public route
router.post('/', [
    check('email', 'Please enter your email.').isEmail(),
    check('password', 'Password is incorrect.').isLength({ min: 8 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(400).json({ msg: errors.array()[0].msg });

    const { email, password } = req.body;

    try {
      //verify email exists
      let user = await User.findOne({ email });
      if(!user) 
        return res.status(400).json({ msg: 'No account exists for input email.'});

      //validate password - gets salt and rounds from saved hash
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) 
        return res.status(400).json({msg: 'Password is incorrect.'});

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
);

// update user
// PUT api/auth/:id (user id)
// Private route
router.put('/:id', [ auth, [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { firstName, lastName, alias, email, isSearchable } = req.body;

  const userFields = {};
  if(firstName) userFields.firstName = firstName;
  if(lastName) userFields.lastName = lastName;
  if(alias || alias === '') userFields.alias = alias;
  if(email) userFields.email = email;
  userFields.isSearchable = isSearchable;

  try {
    //verify current user sent request
    if(req.params.id !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.id  });
    if(!user) 
      return res.status(400).json({ msg: 'User not found.'});

    //ensure email has not already been used
    let test = await User.findOne({ email });
    //using Mongoose virtual getter
    if(test && test.id !== user.id()) {
      return res.status(400).json({ msg: 'Another account already exists for this email.'});
    }

    //update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json({user, msg: 'User updated!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// change user password
// PUT api/auth/password/:id (user id)
// Private route
router.put('/password/:id', [ auth, [
  check('oldPassword', 'Password is incorrect.').isLength({ min: 8 }),
  check('newPassword', 'Password must have at least eight characters.').isLength({ min: 8 })
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { newPassword, oldPassword } = req.body;

  try {
    //verify current user sent request
    if(req.params.id !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.id  });
    if(!user) 
      return res.status(400).json({ msg: 'User not found.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) 
      return res.status(400).json({msg: 'Password is incorrect.'});

    //create salt and hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    //save user
    await user.save();

    res.json({msg: 'Password changed!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// delete user, user goals, and user requests
// DELETE api/auth/:id
// Private route
router.delete('/:id', auth, async (req, res) => {
  const { password } = req.body;

  try {
    //verify current user sent request
    if(req.params.id !== req.user.id)
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //find user
    let user = await User.findOne({ _id: req.params.id  });
    if(!user) 
      return res.status(400).json({ msg: 'User not found.'});

    //validate password - gets salt and rounds from saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) 
      return res.status(400).json({msg: 'Password is incorrect.'});

    //delete user goals
    await Goal.deleteMany({ user: req.params.id });

    //delete user requests
    await Request.deleteMany({ $or: [ 
      { requester: req.params.id} , 
      { requestee: req.params.id } 
    ]});

    //TODO delete user from friends arrays

    //TODO delete user from competitions 

    //TODO delete user invites

    //delete user
    await User.findByIdAndDelete(req.params.id);
    res.json({msg: 'User deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// get searchable users
// GET api/auth/users
// Private route
router.get('/users', auth, async (req, res) => {
  try {
    //finds user but does not return password
    const users = await User.find(
      { isSearchable: true, _id: { $ne: req.user.id }}
    ).select('_id firstName lastName email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;