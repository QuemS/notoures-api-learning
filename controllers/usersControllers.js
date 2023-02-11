const path = require('path');
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
