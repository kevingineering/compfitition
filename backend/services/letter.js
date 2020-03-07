const Letter = require('../models/Letters');

//add new letter
exports.addNewLetter = async (letterFields, session = null) => {
  const newLetter = new Letter(letterFields)
  await newLetter.save({ session: session });
  return newLetter;
}

//get letter by letterId - TODO - IS THIS NECESSARY?
exports.getLetterById = async (letterId) => {
  const letter = await Letter.findById(letterId);
  return letter;
}

//get user letters that aren't 'fromUser'
exports.getLettersByUserId = async (userId) => {
  const letters = await Letter.find({ userId: userId, type: {$ne: 'fromUser'} });
  return letters;
}

//get comp letters with type 'fromUser', 'toUser', or 'requestAdmin'
exports.getLettersByCompId = async (compId) => {
  const letters = await Letter.find({ compId: compId, $or: [{type: 'fromUser'}, {type: 'toUser'}, {type: 'requestAdmin'}] });
  return letters;
}

//TODO update letter expiration by compId
exports.updateLetterExpirationDate = async (compId, date, session = null) => {
  //TODO
}

//delete letter
exports.deleteLetterById = async (letterId) => {
  await Letter.findByIdAndDelete(letterId);
}

//delete all user letters
exports.deleteAllUserLetters = async (userId, session = null) => {
  await Letter.deleteMany({ userId: userId }, { session: session });
}

//delete all competition letters
exports.deleteAllCompetitionLetters = async (compId, session = null) => {
  await Letter.deleteMany({ compId: compId }, { session: session });
}

//does not interact with database, but calls function that does
exports.addCompDeletedLetters = async (userIds, compId, compName, session = null) => {
  for (let i = 0; i < userIds.length; i++) {
    const letterFields = {
      compId: compId, 
      message: `Competition '${compName}' has been deleted. The competition goal has been saved as a personal goal.`,
      userId: userIds[i], 
      type: 'compDeleted'
    }
    await this.addNewLetter(letterFields, session);
  }
}