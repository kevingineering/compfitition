const express = require('express');
const auth = require('../middleware/auth');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.get('/', 
  auth, 
  friendController.getUserFriends
);

router.patch('/add/:userid', 
  auth, 
  friendController.addFriend
);

router.patch('/remove/:userid', 
  auth, 
  friendController.deleteFriend
);

router.get('/goals/:userid', 
  auth, 
  friendController.getFriendGoals
);

router.get('/friends/:userid', 
  auth, 
  friendController.getFriendFriends
);

module.exports = router;