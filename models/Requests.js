const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  //name is alias/name of individual sending request
  name: {
    type: String,
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  requestee: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', RequestSchema);