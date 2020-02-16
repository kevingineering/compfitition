const mongoose = require('mongoose');

const CompetitionSchema = mongoose.Schema({
  //goal is ID of template goal
  //template goal is goal that will be copied any time a user joins a competition 
  //see Goal model for more notes
  goalId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  //users is array of all users (including admins) in a competition
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  //users is array of admin users in a competition
  adminIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Competition', CompetitionSchema);