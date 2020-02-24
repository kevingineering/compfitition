const mongoose = require('mongoose');

const LetterSchema = mongoose.Schema({
  //goal is ID of template goal
  compId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  //letter message
  message: {
    type: String,
    required: true
  },
  //id of user letter is to
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //type dictates type of letter
  //type can be toUser, fromUser, userAdded, userKicked, compDeleted
  type: {
    type: String,
    required: true
  },
  //deletes the letter after a certain date
  expireAt: {
    type: Date,
    index: { expires: '-5m'}
  }
});

module.exports = mongoose.model('Letter', LetterSchema);