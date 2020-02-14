const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkValidation } = require('../controllers/validation');
const auth = require('../middleware/auth');

router.get('/', 
  auth, 
  authController.getUser
);

router.post('/', 
  authController.validateLoginRequest,
  checkValidation,
  authController.loginUser
);

router.patch('/:userid', 
  auth, 
  authController.validateUpdateRequest,
  checkValidation,
  authController.updateUser
);

router.patch('/password/:userid', 
  auth, 
  authController.validateChangePasswordRequest,
  checkValidation,
  authController.changeUserPassword
);

router.delete('/:userid', 
  auth, 
  authController.deleteUser
);

router.get('/users', 
  auth, 
  authController.getSearchableUsers
);

module.exports = router;