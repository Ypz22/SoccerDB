const express = require('express');
const {
    getAllTeams,
    createTeam,
    updateTeam,
    deleteTeam,
} = require('../controller/Teams.controller.js');

const router = express.Router();

router.get('/', getAllTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;
