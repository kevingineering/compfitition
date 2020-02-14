const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check } = require('express-validator');

const registerUser = async (req, res) => {
  const { firstName, lastName, alias, email, password, searchable } = req.body;

  try {
    //check if email already used
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ msg: 'Account already exists for this email address.'});

    //create user
    user = new User({ firstName, lastName, alias, email, password, searchable });

    //create salt and hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //save user
    await user.save();

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

const validateRegisterRequest = [
  check('firstName', 'Please enter your first name.').not().isEmpty(),
  check('lastName', 'Please enter your last name.').not().isEmpty(),
  check('email', 'Please enter a valid email.').isEmail(),
  check('password', 'Please enter a password with eight or more characters.').isLength({ min: 8 })
]

exports.registerUser = registerUser;
exports.validateRegisterRequest = validateRegisterRequest;