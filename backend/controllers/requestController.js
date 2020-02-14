const Request = require('../models/Requests');
const User = require ('../models/Users');

const getRequests = async (req, res) => {
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
}

const addRequest = async (req, res) => {
  //verify not adding self
  if (req.params.userid === req.user.id)
    return res.status(400).json({ msg: 'You cannot add yourself as a friend.'});
    
  try {
    //verify other user exists
    const user = await User.findById(req.params.userid);
    if (!user)
      return res.json({msg: 'User does not exist.'});

    //verify not already friends
    const idArray = await User.findById(req.user.id).select('friends -_id');
    if (idArray.friends.includes(req.params.userid))
      return res.json({msg: 'You are already friends with this user!'})

    //verify equivalent request does not exist
    const requestArray = await Request.find({$or: [
      { requester: req.user.id, requestee: req.params.userid},
      { requester: req.params.userid, requestee: req.user.id}
    ]});
    if(requestArray.length !== 0)
      return res.status(400).json({ msg: 'Friend request already exists.'});

    //get user attributes
    const userInfo = await User.findById(req.user.id);

    //add request
    const request = new Request({ 
      requester: req.user.id, 
      requestee: req.params.userid,
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
}

const deleteRequests = async (req, res) => {
  try {
    //verify request exists and delete
    const requestId = await Request.findOne({$or: [
      { requester: req.user.id, requestee: req.params.userid},
      { requester: req.params.userid, requestee: req.user.id}
    ]}).select('_id');
    if(!requestId)
      return res.status(404).json({ msg: 'Request not found.'});
    else {
      await Request.findByIdAndDelete( requestId );
      res.json(requestId);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.getRequests = getRequests;
exports.addRequest = addRequest;
exports.deleteRequests = deleteRequests;