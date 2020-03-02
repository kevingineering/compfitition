const userService = require('../services/user');
const letterService = require('../services/letter');
const competitionService = require('../services/competition');

exports.getLetters = async(req, res) => {
  try {
    const letters = await letterService.getLettersByUserId(req.user.id);
    res.json(letters);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//invite user to join competition
exports.addLetterToUser = async (req, res) => {
  try {
    const {compName, compId, userId, startDate} = req.body

    letterService.addNewLetter({
      compId, 
      message: `You have been invited to join ${compName}!`,
      userId, 
      type: 'toUser',
      expireAt: startDate
    })

    res.json({ msg: 'Invite sent.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//user asked to join competition
exports.addLetterFromUser = async (req, res) => {
  try {
    const {userName, compId, userId, startDate} = req.body
    
    letterService.addNewLetter({
      compId, 
      message: `${userName} has requested to join this competition!`,
      userId, 
      type: 'fromUser',
      expireAt: startDate
    })

    res.json({ msg: 'Request sent.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//tell user they were added to competition
exports.addLetterUserAdded = async (req, res) => {
  try {
    const {compName, compId, userId} = req.body

    letterService.addNewLetter({
      compId, 
      message: `Your request to join ${compName} has been approved!`,
      userId, 
      type: 'userAdded'
    })
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//tell user they have been removed from competition
exports.addLetterUserKicked = async (req, res) => {
  try {
    const {compName, compId, userId} = req.body

    letterService.addNewLetter({
      compId, 
      message: `You have been removed from ${compName}.`,
      userId, 
      type: 'userKicked'
    })
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//tell user competition was deleted
exports.addLetterCompDeleted = async (req, res) => {
  try {
    const {compName, compId, userId} = req.body

    letterService.addNewLetter({
      compId, 
      message: `Competition ${compName} has been deleted. You can find your progress in your goals.`,
      userId, 
      type: 'compDeleted'
    })
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete letter after user dismisses it
exports.deleteLetter = async (req, res) => {
  try {
    const {letterId} = req.body

    letterService.deleteLetterById(letterId)
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//TODO - MOVE TO USER DELETION delete all user letters when user deletes account
exports.deleteAllUserLetters = async (req, res) => {
  try {
    const {userId} = req.body
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//TODO - MOVE TO COMPETITION DELETION delete letters when competition deleted
exports.deleteAllCompetitionLetters = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//TODO - MOVE TO COMPETITION UPDATED - change date on letter when start date on competition is changed
exports.updateLetterExpirationDate = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}