const express = require('express')
const auth = require('../middleware/auth')
const goalController = require('../controllers/goalController')
const router = express.Router()

router.get('/', 
  auth, 
  goalController.getGoals
)

router.post('/', 
  auth, 
  goalController.addGoal
)

router.patch('/:goalId', 
  auth, 
  goalController.updateGoal
)

router.patch('/tracker/:goalId', 
  auth, 
  goalController.updateGoalTracker
)

router.delete('/:goalId', 
  auth, 
  goalController.deleteGoal
)

module.exports = router