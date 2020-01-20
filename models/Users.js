const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  alias: {
    type: String, 
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  //searchable determines whether or not others can find them to add them as friends
  searchable: {
    type: Boolean,
    default: true
  },
  friends: {
    type: Array
  }
});

module.exports = mongoose.model('User', UserSchema);