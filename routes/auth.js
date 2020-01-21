const express = require('express');
const router = express.Router();
const User = require('../models/Users');
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
// PUT api/auth/:id
// Private route
router.put('/:id', [ auth, [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { firstName, lastName, alias, email, searchable, password } = req.body;

  const userFields = {};
  if(firstName) userFields.firstName = firstName;
  if(lastName) userFields.lastName = lastName;
  if(alias || alias === '') userFields.alias = alias;
  if(email) userFields.email = email;
  if(searchable) userFields.searchable = searchable;

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
    if(test && test._id.toString() !== user._id.toString()) {
      return res.status(400).json({ msg: 'Another account already exists for this email.'});
    }

    //update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true}
    );

    res.json({user, msg: 'User updated!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// change user password
// PUT api/auth/password/:id
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

// delete user
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

    //delete user
    await User.findByIdAndRemove(req.params.id);
    res.json({msg: 'User deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
})

// NEEDS FINISHED

// //add friend to user
// //PUT api/user/friends/:id
// //Private route
// router.put('/:id', auth, async (req, res) => {
//   const { id } = req.body;

//   try {
//     //verify friend exists
//     let friend = await User.findById(id);
//     if(!friend) 
//       return res.status(404).json({ msg: 'Friend is not found.'});

//     //add friend id to user friend array
//     await User.findByIdAndUpdate(
//       req.params.id,
//       user.friends.addToSet(id),
//       { new: true }
//     );

//     res.json(goal);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error.' });
//   }
// });

module.exports = router;