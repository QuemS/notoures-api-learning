const catchAsync = require('../utils/catchAsync');
const Review = require('../model/modelReviews');

exports.createReview = catchAsync(async (req, res) => {

  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;


  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      reviews: newReview,
    },
  });
});

exports.allReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find()

  res.status(201).json({
    status: 'success',
    data: {
      reviews
    },
  });
});