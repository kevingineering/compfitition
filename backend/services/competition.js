const Competition = require('../models/Competitions');

//add new 
exports.addNewCompetition = async (compFields, session = null) => {
  const competition = new Competition(compFields);
  await competition.save({ session: session })
  return competition;
}

//get competition by compId
exports.getCompetitionById = async (compId) => {
  const competition = await Competition.findById(compId);
  return competition;
}

//add user to competition
exports.addUserToCompetition = async (compId, userId, session = null) => {
  const competition = await Competition.findByIdAndUpdate(
    compId,
    { $addToSet: { 'userIds': userId }},
    { new: true, session: session }
  );
  return competition;
}

//remove user to competition
exports.removeUserFromCompetition = async (compId, userId, session = null) => {
  const competition = await Competition.findByIdAndUpdate(
    compId,
    { $pull: { userIds: userId }},
    { new: true, session: session }
  );
  return competition;
}

//add admin to competition
exports.addAdminToCompetition = async (compId, userId, session = null) => {
  const competition = await Competition.findByIdAndUpdate(
    compId,
    { $addToSet: { 'adminIds': userId }},
    { new: true, session: session }
  );
  return competition;
}

//remove admin to competition
exports.removeAdminFromCompetition = async (compId, userId) => {
  const competition = await Competition.findByIdAndUpdate(
    compId,
    { $pull: { adminIds: userId }},
    { new: true }
  );
  return competition;
}

//delete competition by compId
exports.deleteCompetitionById = async (compId, session = null) => {
  await Competition.findByIdAndDelete(
    compId, 
    { session: session }
  )
}