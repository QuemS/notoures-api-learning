const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewsControllers = require('../controllers/reviewsControllers');
const authController = require('../controllers/authController');


router.route('/').get(reviewsControllers.allgetReviews).post(authController.protect, reviewsControllers.setTourUserId, reviewsControllers.createReview);

router.route('/:id').get(reviewsControllers.getReview).delete(authController.protect, authController.restrictTo('admin'), reviewsControllers.deleteReview).patch(reviewsControllers.updateReview);

module.exports = router;
