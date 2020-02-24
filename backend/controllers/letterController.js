exports.getLetters = async(req, res) => {
  try {
    const letters = await Letter.find({ userId: req.user.id });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.addLetterToUser = async (req, res) => {
  try {
    const {compId, message, userId, startDate} = req.body

    //check if user already in competition

    //check if letter already exists
    const letter = letter.findOne({
      $and : [
        {compId: ''}, 
        {userId: ''},
        {type: 'toUser'}
      ]
    })

    if(letter)
      return res.status(400).json({ msg: 'This letter already exists.'})

    //add letter
    const newLetter = new Letter({ 
      compId, 
      message,
      userId, 
      type: 'toUser',
      expireAt: startDate
    });

    await newLetter.save();

    //sending back both request
    res.json({ msg: 'Letter sent.' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' });
  }
}

exports.addLetterFromUser = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.addLetterUserAdded = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.addLetterUserKicked = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.addLetterCompDeleted = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.deleteLetter = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.deleteAllCompetitionLetters = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}

exports.updateLetterExpirationDate = async (req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
}