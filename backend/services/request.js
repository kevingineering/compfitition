const Request = require('../models/Requests');

//add request
exports.addNewRequest = async (requestFields) => {
  try {
    const newRequest = new Request(requestFields)
    await newRequest.save();
    return newRequest;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get requests including user
exports.getRequestsWithOneUser = async (id) => {
  try {
    const requests = await Request.find({ $or: [
      { requestee: id }, 
      { requester: id }
    ]}).sort({ startDate: 1 });
    return requests;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get request including two users
exports.getRequestsWithTwoUsers = async (id1, id2) => {
  try {
    const requestId = await Request.findOne({$or: [
      { requester: id1, requestee: id2 },
      { requester: id2, requestee: id1 }
    ]})
    return requestId;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete request by id
exports.deleteRequestById = async (id) => {
  try {
    await Request.findByIdAndDelete(id);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete all requests involving user
exports.deleteAllUserRequests = async (id, session = null) => {
  try {
    await Request.deleteMany(
      { $or: [ 
        { requester: id} , 
        { requestee: id } 
      ]}, 
      { session: session }  
    );
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}