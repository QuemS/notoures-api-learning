const express = require('express');

const router = express.Router();
const toursControllers = require('../controllers/toursControllers');
const authController = require('../controllers/authController');
// const reviewsControllers = require('../controllers/reviewsControllers');

const reviewsRouter = require("./reviewsRoutes");


// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewsControllers.createReview);

router.use('/:tourId/reviews', reviewsRouter)

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
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'), toursControllers.updateToor)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteToor
  );



module.exports = router;

//Post /tours/asdasdas/reviews/
//Get /tours/asdasdas/reviews/
