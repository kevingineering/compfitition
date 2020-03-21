const mongoose = require('mongoose')

const LetterSchema = mongoose.Schema({
  //compId indicates competition letter is associated with
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
  //id of user letter is from 
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //type dictates type of letter
  //type can be toUser (tell user an admin invited them to join competition), fromUser (tell admin user asked to join competition), userAdded (tell user their request to join competition was granted), userKicked (tell user they were kicked from competition), compDeleted (tell user a competition was deleted), or requestAdmin (user has been asked to be an admin of a competition)
  type: {
    type: String,
    required: true
  },
  //deletes the letter after a certain date
  expireAt: {
    type: Date,
    index: { expires: '-5m'}
  }
})

module.exports = mongoose.model('Letter', LetterSchema)