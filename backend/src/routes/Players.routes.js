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

router.get('/', authMiddleware, getAllPlayers);
router.get('/:id', authMiddleware, getPlayerById);
router.post('/', authMiddleware, createPlayer);
router.put('/:id', authMiddleware, updatePlayer);
router.delete('/:id', authMiddleware, deletePlayer);

module.exports = router;
