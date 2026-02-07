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

router.use(authMiddleware);

router.get('/', getAllDirector);
router.get('/:id', getDirectorById);
router.post('/', createDirector);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);

module.exports = router;
