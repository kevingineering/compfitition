const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  //name is alias/name of individual sending request
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  requestee: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', RequestSchema);