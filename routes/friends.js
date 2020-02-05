const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Goal = require('../models/Goals');
const auth = require('../middleware/auth');

// get user friends
// GET api/friends
// Private route
router.get('/', auth, async (req, res) => {
  try {
    //get user friends array - array of ids
    const idArray = await User.findById(req.user.id).select('friends -_id');

    //get array of user items from friends array
    const friendArray = await User.find({ _id: { $in: idArray.friends }}).select('firstName lastName email alias _id ');
    res.json(friendArray);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// add friend to user
// PUT api/friends/add/:id (user id)
// Private route
router.put('/add/:id', auth, async (req, res) => {
  //verify user not adding themselves
  if (req.params.id === req.user.id)
    res.json({msg: 'You cannot add yourself as a friend!'})

  try {
    const friend = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { 'friends': req.user.id }}
    ).select('firstName lastName email alias _id ');

    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { 'friends': req.params.id }},
      { new: true}
    );
    res.json(friend);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// delete user friend
// PUT api/friends/remove/:id (user id)
// Private route
router.put('/remove/:id', auth, async (req, res) => {
  //verify user not adding themselves
  if (req.params.id === req.user.id)
  res.json({msg: 'You cannot delete yourself as a friend!'})
  
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { 'friends': req.user.id }}
    );

    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { 'friends': req.params.id }}
    ).select('firstName lastName email alias _id ');
    res.json({msg: 'Friend deleted!'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// get goals of friend with privacy set to 'friends' or 'public' 
// GET api/friends/goals/:id (user id)
// Private route
router.get('/goals/:id', auth, async (req, res) => {
  //verify user is friends with :id
  const idArray = await User.findById(req.user.id).select('friends -_id');
  if (!idArray.friends.includes(req.params.id))
    res.json({msg: 'You are not friends with this user!'})

  try {
    const goals = await Goal.find({ 
      user: req.params.id, 
      privacy : { $ne : 'only me' }
    }).sort({ startDate: 1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

// get friends of friend who are mutual or who are searchable
// GET api/friends/friends/:id (user id)
// Private route
router.get('/friends/:id', auth, async (req, res) => {
  try {
    //verify user is friends with :id
    const idArray = await User.findById(req.params.id).select('friends -_id');
    if (!idArray.friends.includes(req.user.id))
      res.json({msg: 'You are not friends with this user!'})

    //get friends of friend
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
});

module.exports = router;