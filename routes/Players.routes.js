import express from 'express';
import {
    getAllPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer
} from '../controller/Players.controller.js';

const router = express.Router();

router.get('/', getAllPlayers);

router.post('/', createPlayer);

router.put('/:id', updatePlayer);

router.delete('/:id', deletePlayer);

export default router;
