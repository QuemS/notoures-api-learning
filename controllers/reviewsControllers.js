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

exports.allgetReviews = catchAsync(async (req, res) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);


  res.status(201).json({
    status: 'success',
    data: {
      reviews
    },
  });
});