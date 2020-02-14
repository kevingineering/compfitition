const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkValidation } = require('../controllers/validation');

router.post('/', 
  userController.validateRegisterRequest,
  checkValidation,
  userController.registerUser 
);

module.exports = router;