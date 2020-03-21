const requestService = require('../services/request')
const userService = require('../services/user')

exports.getRequests = async (req, res) => {
  try {
    const requests = await requestService.getRequestsWithOneUser(req.user.id)
    //sending back both request and req.user.id so requests can be sorted
    res.json({requests, userId: req.user.id})
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.addRequest = async (req, res) => {
  //verify not adding self
  if (req.params.userId === req.user.id)
    return res.status(400).json({ msg: 'You cannot add yourself as a friend.'})
    
  try {
    //verify other user exists
    const userAdding = await userService.getUserById(req.params.userId)
    if (!userAdding)
      return res.json({msg: 'User does not exist.'})

    //verify not already friends
    const user = await userService.getUserById(req.user.id)
    if (user.friends.includes(req.params.userId))
      return res.json({msg: 'You are already friends with this user!'})

    //verify equivalent request does not exist
    const requestId = await requestService.getRequestsWithTwoUsers(req.params.userId, req.user.id)
    if(requestId)
      return res.status(400).json({ msg: 'Friend request already exists.'})

    //add request
    const requestFields = { 
      requester: req.user.id, 
      requestee: req.params.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    const request = await requestService.addNewRequest(requestFields)

    //sending back both request
    res.json(request)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}

exports.deleteRequests = async (req, res) => {
  try {
    //verify equivalent request does not exist
    const requestId = await requestService.getRequestsWithTwoUsers(req.params.userId, req.user.id)
    if(!requestId)
      return res.status(404).json({ msg: 'Request not found.'})
    else {
      //delete request and return requestId so state can be updated
      await requestService.deleteRequestById(requestId._id)
      res.json(requestId._id)
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}