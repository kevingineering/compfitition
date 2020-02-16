const mongoose = require('mongoose');

const InviteSchema = mongoose.Schema({
  //goal is ID of template goal
  compId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  //message will be displayed to invitee
  message: {
    type: String,
    required: true
  },
  //id of user who has been invited
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //deltes the invite after a certain date
  expireAt: {
    type: Date,
    index: { expires: '-5m'}
  }
});

module.exports = mongoose.model('Invite', InviteSchema);