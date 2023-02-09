const express = require('express');

const router = express.Router();
const toursControllers = require('../controllers/toursControllers');
const authController = require('../controllers/authController');

router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);
router.route('/tour-stats').get(toursControllers.getTourStat);
router
  .route('/top-5-chips')
  .get(toursControllers.aliasTopTours, toursControllers.getAllTours);
router
  .route('/')
  .get(authController.protect, toursControllers.getAllTours)
  .post(toursControllers.createToor);
router
  .route('/:id')
  .get(toursControllers.getTour)
  .patch(toursControllers.updateToor)
  .delete(toursControllers.deleteToor);

module.exports = router;
