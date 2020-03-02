const Request = require('../models/Requests');

//add request
exports.addNewRequest = async (requestFields) => {
  const newRequest = new Request(requestFields)
  await newRequest.save();
  return newRequest;
}

//get requests including user
exports.getRequestsWithOneUser = async (userId) => {
  const requests = await Request.find({ $or: [
    { requestee: userId }, 
    { requester: userId }
  ]}).sort({ startDate: 1 });
  return requests;
}

//get request including two users
exports.getRequestsWithTwoUsers = async (userId1, userId2) => {
  const requestId = await Request.findOne({$or: [
    { requester: userId1, requestee: userId2 },
    { requester: userId2, requestee: userId1 }
  ]})
  return requestId;
}

//delete request by requestId
exports.deleteRequestById = async (requestId) => {
    await Request.findByIdAndDelete(requestId);
}

//delete all requests involving user
exports.deleteAllUserRequests = async (userId, session = null) => {
  await Request.deleteMany(
    { $or: [ 
      { requester: userId} , 
      { requestee: userId } 
    ]}, 
    { session: session }  
  );
}