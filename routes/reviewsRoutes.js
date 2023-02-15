const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewsControllers = require('../controllers/reviewsControllers');
const authController = require('../controllers/authController');


router.route('/').get(reviewsControllers.allgetReviews).post(authController.protect, authController.restrictTo('user'), reviewsControllers.createReview);

module.exports = router;
