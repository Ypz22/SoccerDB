const express = require('express');
const {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
} = require('../controller/Teams.controller.js');

const router = express.Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
