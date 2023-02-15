const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No doc fount with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Done ! File delete',
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No doc fount with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    },
    message: 'Done ! update file',
  });
});

exports.createOne = Model => catchAsync(async (req, res) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {

  let query = Model.findById(req.params.id);

  if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;
  console.log(doc);
  if (!doc) {
    return next(new AppError('No document fount with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    },
  });
});


