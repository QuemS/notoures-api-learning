const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'error',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'error',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'error',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'error',
  });
};
