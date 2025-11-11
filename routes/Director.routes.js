import express from 'express';
import { getAllDirector,createDirector,updateDirector,deleteDirector } from '../controller/Director.controller';

const router = express.Router();

router.get('/',getAllDirector);

router.post('/',createDirector);

router.put('/:id',updateDirector);

router.delete('/:id', deleteDirector);

export default router;
