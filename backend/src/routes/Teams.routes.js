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

router.get('/', authMiddleware, getAllTeams);
router.get('/:id', authMiddleware, getTeamById);
router.post('/', authMiddleware, createTeam);
router.put('/:id', authMiddleware, updateTeam);
router.delete('/:id', authMiddleware, deleteTeam);

module.exports = router;
