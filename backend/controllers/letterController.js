const letterService = require('../services/letter');

exports.getLetters = async(req, res) => {
  try {
    let letters = [];
    if (req.params.compId) {
      letters = await letterService.getLettersByCompId(req.params.compId);
    } else {
      letters = await letterService.getLettersByUserId(req.user.id);
    }
    res.json(letters);
  } catch (err) {
   //console.log{err)
    res.status(500).json({ msg: 'Server error.' });
  }
}

//add letter based on letter type - see letter model
//note comp deleted letters are handled by function in letter service
exports.addLetter = async (req, res) => {
  try {
    const {type, compId, compName, userId, userName = '', startDate = null } = req.body

    let letterFields = {
      compId,
      message: '',
      userId,
      senderId: req.user.id,
      type: type,
      expireAt: startDate
    }

    switch(type) {
      case 'toUser':
        letterFields.message = `${userName} invited you to join ${compName}!`
        break;
      case 'fromUser':
        letterFields.message = `${userName} has requested to join this competition!`
        break;
      case 'userAdded':
        letterFields.message = `${userName} approved your request to join ${compName}!`
        break;
      case 'userKicked':
        letterFields.message = `You have been removed from ${compName}. The competition goal has been saved as a personal goal.`
        break;
      case 'requestAdmin':
        letterFields.message = `You have been asked to be an admin for ${compName}.`
        break;
      default:
        return res.status(500).json({ msg: 'Invalid letter type.'}) 
    }

    const letter = await letterService.addNewLetter(letterFields)

    res.json({ msg: 'Invite sent.', letter });
  } catch (err) {
   //console.log{err)
    res.status(500).json({ msg: 'Server error.' });
  }
}

//delete letter after user dismisses it
exports.deleteLetter = async (req, res) => {
  try {
    const letterId = req.params.letterId

    //verify letter exists
    const letter = await letterService.getLetterById(letterId)
    if (!letter) return res.status(404).json({msg: 'Letter not found.'})

    //delete letter
    await letterService.deleteLetterById(letterId)

    res.json({ msg: 'Letter deleted.', letterId: req.params.letterId})
  } catch (err) {
   //console.log{err)
    res.status(500).json({ msg: 'Server error.' });
  }
}