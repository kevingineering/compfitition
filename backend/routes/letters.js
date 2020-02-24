const express = require('express');
const auth = require('../middleware/auth');
const letterController = require('../controllers/letterController');

const router = express.Router();

router.get('/', 
  auth, 
  letterController.getLetters
);

router.post('/toUser', 
  auth, 
  letterController.addLetterToUser
);

router.post('/fromUser', 
  auth, 
  letterController.addLetterFromUser
);

router.post('/userAdded', 
  auth, 
  letterController.addLetterUserAdded
);

router.post('/userKicked', 
  auth, 
  letterController.addLetterUserKicked
);

router.post('/compDeleted', 
  auth, 
  letterController.addLetterCompDeleted
);

router.delete('/:letterid',
  auth,
  letterController.deleteLetter
)

router.delete('/:compId',
  auth,
  letterController.deleteAllCompetitionLetters
)

router.patch('/:compId',
  auth,
  letterController.updateLetterExpirationDate
)

module.exports = router;