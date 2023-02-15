const path = require('path');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handlerFactory");

const filterObj = (obj, ...alloweFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (alloweFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.updateMe = catchAsync(async (req, res, next) => {
  //1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not password updates. Please use /updateMyPassword', 400))
  }
  //2.Filtered out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email');

  //3. Update user document

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, { new: true, runValidators: true });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  })
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  })
})



exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'error',
  });
};
exports.getImg = catchAsync(async (req, res, next) => {
  const options = {
    root: path.join(__dirname, '../dev-data/img/'),
  };

  const fileName = req.params.name;

  res.status(200).sendFile(fileName, options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});
//Do not update passtwords with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);






