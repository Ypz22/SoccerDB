import express from 'express';
import { getAllTeams, createTeam, updateTeam, deleteTeam } from '../controller/Teams.controller.js';

const router = express.Router();

router.get('/', getAllTeams);

router.post('/', createTeam);

router.put('/:id', updateTeam);

router.delete('/:id', deleteTeam);

export default router;