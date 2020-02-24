const express = require('express');
const auth = require('../middleware/auth');
const competitionController = require('../controllers/competitionController');

const router = express.Router();

router.get('/:compId', 
  auth, 
  competitionController.getCompetition
  );

router.get('/goals/:compId', 
  auth, 
  competitionController.getCompetitionGoals
);

router.get('/participants/:compId', 
  auth, 
  competitionController.getCompetitionParticipants
);

router.post('/:goalId', 
  auth, 
  competitionController.createCompetitionByGoalId
);

router.delete('/:compId', 
  auth, 
  competitionController.deleteCompetition
);

router.patch('/:compId', 
  auth, 
  competitionController.updateCompetition
  );

router.patch('/adduser/:compId', 
  auth, 
  competitionController.addUserToCompetition
);

router.patch('/removeuser/:compId', 
  auth, 
  competitionController.removeUserFromCompetition
);

router.patch('/kickuser/:compId', 
  auth, 
  competitionController.kickUserFromCompetition
  );

router.patch('/addadmin/:compId', 
  auth, 
  competitionController.addAdminToCompetition
  );

router.patch('/removeadmin/:compId', 
  auth, 
  competitionController.removeAdminFromCompetition
);

module.exports = router;