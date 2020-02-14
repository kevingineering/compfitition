const express = require('express');
const auth = require('../middleware/auth');
const goalController = require('../controllers/goalController');
const router = express.Router();

router.get('/', 
  auth, 
  goalController.getGoals
);

router.post('/', 
  auth, 
  goalController.addGoal
);

router.patch('/:goalid', 
  auth, 
  goalController.updateGoal
);

router.patch('/tracker/:goalid', 
  auth, 
  goalController.updateGoalTracker
);

router.delete('/:goalid', 
  auth, 
  goalController.deleteGoal
);

module.exports = router;