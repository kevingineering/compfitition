const mongoose = require('mongoose');

const CompetitionSchema = mongoose.Schema({
  //goal is ID of goal prototype
  goalId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'goals',
    required: true
  },
  //users is array of all users (including admins) in a competition
  userIds: {
    type: Array,
    required: true
  },
  //users is array of admin users in a competition
  adminIds: {
    type: Array,
    required: true
  },
  //determines if highest or lowest number wins
  isMax: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Competition', CompetitionSchema);