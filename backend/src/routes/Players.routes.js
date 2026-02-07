const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');

const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controller/Players.controller.js');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router;
