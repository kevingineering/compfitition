const mongoose = require('mongoose')

const RequestSchema = mongoose.Schema({
  //requester is id of individual sending request
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  //requestee is id of individual receiving request
  requestee: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  //firstName is name of requestee
  firstName: {
    type: String,
    required: true
  },
  //lastName is of requester
  lastName: {
    type: String,
    required: true
  },
  //email is of requester
  email: {
    type: String,
    required: true
  },
  //date request is created
  requestDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Request', RequestSchema)