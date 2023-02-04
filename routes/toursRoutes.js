const express = require('express');

const router = express.Router();
const {
  getAllTours,
  createToor,
  getTour,
  updateToor,
  deleteToor,
} = require('../controllers/toursControllers');

router.route('/').get(getAllTours).post(createToor);
router.route('/:id').get(getTour).patch(updateToor).delete(deleteToor);

module.exports = router;
