const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');

const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} = require('../controller/Teams.controller.js');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
