const express = require('express');

const router = express.Router();

const reviewsControllers = require('../controllers/reviewsControllers');
const authController = require('../controllers/authController');


router.route('/').get(reviewsControllers.allReviews).post(authController.protect, authController.restrictTo('user'), reviewsControllers.createReview);

module.exports = router;
