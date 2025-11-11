const express = require('express');
const {
    getAllPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer
} = require('../controller/Players.controller.js');

const router = express.Router();

router.get('/', getAllPlayers);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router;
