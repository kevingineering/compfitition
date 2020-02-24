const Competition = require('../models/Competitions');

//add new 
exports.addNewCompetition = async (compFields, session = null) => {
  try {
    const competition = new Competition(compFields);
    await competition.save({ session: session })
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//get competition by id
exports.getCompetitionById = async (id) => {
  try {
    const competition = await Competition.findById(id);
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//add user to competition
exports.addUserToCompetition = async (compId, userId, session = null) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      compId,
      { $addToSet: { 'userIds': userId }},
      { new: true, session: session }
    );
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//remove user to competition
exports.removeUserFromCompetition = async (compId, userId, session = null) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      compId,
      { $pull: { 'userIds': userId }},
      { new: true, session: session }
    );
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//add admin to competition
exports.addAdminToCompetition = async (compId, userId, session = null) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      compId,
      { $addToSet: { 'adminIds': userId }},
      { new: true, session: session }
    );
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//remove admin to competition
exports.removeAdminFromCompetition = async (compId, userId, session = null) => {
  try {
    const competition = await Competition.findByIdAndUpdate(
      compId,
      { $pull: { 'adminIds': userId }},
      { new: true, session: session }
    );
    return competition;
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete competition by id
exports.deleteCompetitionById = async (id, session = null) => {
  try {
    await Competition.findByIdAndDelete(
      id, 
      { session: session }
    )
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}