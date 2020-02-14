const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.get('/', 
  auth, 
  requestController.getRequests
);

router.post('/:userid', 
  auth, 
  requestController.addRequest
);

router.delete('/:userid', 
  auth, 
  requestController.deleteRequests
);

module.exports = router;