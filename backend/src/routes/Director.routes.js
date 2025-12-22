const express = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');
const {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector
} = require('../controller/Director.controller.js');

const router = express.Router();

router.get('/', authMiddleware,getAllDirector);
router.get('/:id', authMiddleware,getDirectorById);
router.post('/', authMiddleware,createDirector);
router.put('/:id',authMiddleware,updateDirector);
router.delete('/:id',authMiddleware, deleteDirector);

module.exports = router;
