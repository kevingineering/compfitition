const express = require('express');
const router = express.Router();
const Request = require('../models/Requests');
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
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//create request
//POST api/requests
//Private route
router.post('/', auth, async (req, res) => {
  const { name, requester, requestee } = req.body;

  //verify current user sent request
  if(requester !== req.user.id)
    return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

  try {
    const request = new Request({ 
      name,
      requester, 
      requestee
    });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

//delete request
//DELETE api/requests/:id (request id)
//Private route
router.delete('/:id', auth, async (req, res) => {
  try {
    //verify request exists
    let request = await Request.findById(req.params.id);
    if(!request) 
      return res.status(404).json({ msg: 'Request not found.'});

    //ensure user owns request
    if(request.requestee.toString() !== req.user.id && request.requester.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'User is not authorized to perform this action.'});

    //delete request
    await Request.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Request deleted.'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;