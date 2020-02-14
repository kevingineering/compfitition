const express = require('express');
const auth = require('../middleware/auth');
const inviteController = require('../controllers/inviteController');

const router = express.Router();

router.get('/', 
  auth, 
  inviteController.addInvite  
);

router.post('/', 
  auth, 
  inviteController.addInvite
);

router.delete('/:inviteid',
  auth,
  inviteController.deleteInvite
)

router.delete('/:compid',
  auth,
  inviteController.deleteAllCompetitionInvites
)

router.patch('/:compid',
  auth,
  inviteController.updateInviteExpirationDate
)

module.exports = router;