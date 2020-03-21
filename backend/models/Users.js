const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  //alias is optional name for user
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
  //isSearchable determines whether or not others can find them to add them as friends
  isSearchable: {
    type: Boolean,
    default: true
  },
  //array of userIds who are friends with user
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports = mongoose.model('User', UserSchema)