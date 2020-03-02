const Letter = require('../models/Letters');

//add new letter
exports.addNewLetter = async (letterFields) => {
  const newLetter = new Letter(letterFields)
  await newLetter.save();
  return newLetter;
}

//get letter by letterId
exports.getLetterById = async (letterId) => {
  const letter = await Letter.findById(letterId);
  return letter;
}

//get letters
exports.getLettersByUserId = async (userId) => {
  const letters = await Letter.find({ user: userId });
  return letters;
}

//TODO update letter expiration by compId
exports.updateLetterExpirationDate = async (compId, date) => {

}

//delete letter
exports.deleteLetterById = async (letterId) => {
  await Letter.findByIdAndDelete(letterId);
}

//delete all user letters
exports.deleteAllUserLetters = async (userId) => {
  await Letter.deleteMany({ userId: userId });
}

//delete all competition letters
exports.deleteAllCompetitionLetters = async (compId) => {
  await Letter.deleteMany({ compId: compId });
}