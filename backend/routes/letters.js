const express = require('express')
const auth = require('../middleware/auth')
const letterController = require('../controllers/letterController')

const router = express.Router()

router.get('/:compId?', 
  auth, 
  letterController.getLetters
)

router.post('/', 
  auth, 
  letterController.addLetter
)

router.delete('/:letterId',
  auth,
  letterController.deleteLetter
)

module.exports = router