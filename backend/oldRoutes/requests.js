const express = require('express');
const router = express.Router();
const Request = require('../models/Requests');
const User = require ('../models/Users');
const auth = require('../middleware/auth');

//get requests for user
//GET api/requests
//Private route
router.get('/', auth, async(req, res) => {
  try {
    const requests = await Request.find({ $or: [
      { requestee: req.user.id }, 
      { requester: req.user.id }
    ]}).sort({ startDate: 1 });
    //sending back both request and req.user.id so requests can be sorted
    res.json({requests, id: req.user.id});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//create request
//POST api/requests/:id (user id)
//Private route
router.post('/:id', auth, async (req, res) => {
  //verify not adding self
  if (req.params.id === req.user.id)
    return res.status(400).json({ msg: 'You cannot add yourself as a friend.'});
    
  try {
    //verify other user exists
    const user = await User.findById(req.params.id);
    if (!user)
      return res.json({msg: 'User does not exist.'});

    //verify not already friends
    const idArray = await User.findById(req.user.id).select('friends -_id');
    if (idArray.friends.includes(req.params.id))
      return res.json({msg: 'You are already friends with this user!'})

    //verify equivalent request does not exist
    const requestArray = await Request.find({$or: [
      { requester: req.user.id, requestee: req.params.id},
      { requester: req.params.id, requestee: req.user.id}
    ]});
    if(requestArray.length !== 0)
      return res.status(400).json({ msg: 'Friend request already exists.'});

    //get user attributes
    const userInfo = await User.findById(req.user.id);

    //add request
    const request = new Request({ 
      requester: req.user.id, 
      requestee: req.params.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email
    });

    await request.save();

    //sending back both request
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//delete request
//DELETE api/requests/:id (user id)
//Private route
router.delete('/:id', auth, async (req, res) => {
  try {
    //verify request exists and delete
    const requestId = await Request.findOne({$or: [
      { requester: req.user.id, requestee: req.params.id},
      { requester: req.params.id, requestee: req.user.id}
    ]}).select('_id');
    if(!requestId)
      return res.status(400).json({ msg: 'Request not found.'});
    else {
      await Request.findByIdAndDelete( requestId );
      res.json(requestId);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;