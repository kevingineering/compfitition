const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkValidation } = require('../controllers/validation');
const auth = require('../middleware/auth');

router.get('/', 
  auth, 
  userController.getUser
);

router.post('/login', 
  userController.validateLoginRequest,
  checkValidation,
  userController.loginUser
);

router.post('/register', 
  userController.validateRegisterRequest,
  checkValidation,
  userController.registerUser 
);

router.patch('/:userId', 
  auth, 
  userController.validateUpdateRequest,
  checkValidation,
  userController.updateUser
);

router.patch('/password/:userId', 
  auth, 
  userController.validateChangePasswordRequest,
  checkValidation,
  userController.changeUserPassword
);

router.delete('/:userId', 
  auth, 
  userController.deleteUser
);

router.get('/users', 
  auth, 
  userController.getSearchableUsers
);

module.exports = router;