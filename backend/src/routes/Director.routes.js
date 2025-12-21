const express = require('express');
const {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector
} = require('../controller/Director.controller.js');

const router = express.Router();

router.get('/', getAllDirector);
router.get('/:id', getDirectorById);
router.post('/', createDirector);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);

module.exports = router;
