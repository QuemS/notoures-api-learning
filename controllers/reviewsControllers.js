const catchAsync = require('../utils/catchAsync');
const Review = require('../model/modelReviews');
const factory = require("./handlerFactory");

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();

}

exports.createReview = factory.createOne(Review);

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

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);