const express = require('express');
const auth = require('../middleware/auth');
const competitionController = require('../controllers/competitionController');

const router = express.Router();

router.get('/:compid', 
  auth, 
  competitionController.getCompetition
  );

router.get('/goals/:compid', 
  auth, 
  competitionController.getCompetitionGoalsByCompId
);

router.get('/participants/:compid', 
  auth, 
  competitionController.getCompetitionParticipants
);

router.post('/:goalid', 
  auth, 
  competitionController.createCompetitionByGoalId
);

router.delete('/:compid', 
  auth, 
  competitionController.deleteCompetition
);

router.patch('/:compid', 
  auth, 
  competitionController.updateCompetition
  );

router.patch('/adduser/:compid', 
  auth, 
  competitionController.addUserToCompetition
);

router.patch('/removeuser/:compid', 
  auth, 
  competitionController.removeUserFromCompetition
);

router.patch('/kickuser/:compid', 
  auth, 
  competitionController.kickUserFromCompetition
  );

router.patch('/addadmin/:compid', 
  auth, 
  competitionController.addAdminToCompetition
  );

router.patch('/removeadmin/:compid', 
  auth, 
  competitionController.removeAdminFromCompetition
);

module.exports = router;