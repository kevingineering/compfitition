const express = require('express');
const router = express.Router();
const Invite = require('../models/Invites');
const User = require ('../models/Users');
const auth = require('../middleware/auth');

//get invites for user
//GET api/invites
//Private route
router.get('/', auth, async(req, res) => {
  try {
    const invites = await Invite.find({ userId: req.user.id });
    res.json(invites);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//create invite
//POST api/invites/:id (user id)
//Private route
router.post('/:id', auth, async (req, res) => {
  try {
    const {compId, message, userId, startDate, type} = req.body

    //add invite
    const invite = new Invite({ 
      compId, 
      message,
      userId, 
      type,
      expireAt: startDate
    });

    await invite.save();

    //sending back both request
    res.json({ msg: 'Message sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//delete invite

//delele all invites associated with competition

//update expireat on all invites


module.exports = router;