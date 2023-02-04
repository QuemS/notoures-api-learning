const express = require('express');

const router = express.Router();
const {
  getAllTours,
  createToor,
  getTour,
  updateToor,
  deleteToor,
  aliasTopTours,
  getTourStat,
  getMonthlyPlan,
} = require('../controllers/toursControllers');

router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStat);
router.route('/top-5-chips').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createToor);
router.route('/:id').get(getTour).patch(updateToor).delete(deleteToor);

module.exports = router;
