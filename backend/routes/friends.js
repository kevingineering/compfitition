const express = require('express')
const auth = require('../middleware/auth')
const friendController = require('../controllers/friendController')

const router = express.Router()

router.get('/', 
  auth, 
  friendController.getUserFriends
)

router.patch('/add/:userId', 
  auth, 
  friendController.addFriend
)

router.patch('/remove/:userId', 
  auth, 
  friendController.deleteFriend
)

router.get('/goals/:userId', 
  auth, 
  friendController.getFriendGoals
)

router.get('/friends/:userId', 
  auth, 
  friendController.getFriendFriends
)

module.exports = router