const Invite = require('../models/Invites');

const getInvites = async(req, res) => {
  try {
    const invites = await Invite.find({ userId: req.user.id });
    res.json(invites);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const addInvite = async (req, res) => {
  try {
    const {compId, message, userId, startDate, type} = req.body

    //add invite
    const invite = new Invite({ 
      compId, 
      message,
      userId, 
      type,
      expireAt: startDate
    });

    await invite.save();

    //sending back both request
    res.json({ msg: 'Message sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

const deleteInvite = async (req, res) => {
  
}

const deleteAllCompetitionInvites = async (req, res) => {
  
}

const updateInviteExpirationDate = async (req, res) => {
  
}

exports.getInvites = getInvites
exports.addInvite = addInvite
exports.deleteInvite = deleteInvite
exports.deleteAllCompetitionInvites = deleteAllCompetitionInvites
exports.updateInviteExpirationDate = updateInviteExpirationDate