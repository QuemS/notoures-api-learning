const crypto = require('crypto')
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    status: "success",
    token,
  })
}
exports.signUp = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,

  });

  //Create an activation token
  const activateToken = newUser.createTokenUseraActivate();
  await newUser.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/activeEmail/${activateToken}`;

  const message = `Good afternoon, to activate the user, pour the link \n${resetURL}.`
  //Sending email
  try {
    await sendEmail({
      email: newUser.email,
      subject: 'User activation',
      message
    })

    res.status(200).json({
      status: 'success',
      message: "Please activate user!"
    })
  } catch (error) {
    newUser.emailActiveToken = undefined;

    await newUser.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again.later!', 500))
  }


});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2. Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password').select('+emailActiveToken');


  //3.Checking if the account is activated
  if (user.emailActiveToken) {
    return next(new AppError('Account not activated. Please activate', 401))
  }


  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email of password', 401));
  }



  //3. If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1. Gettin token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Plese lo gin to get access.', 401)
    );
  }
  //2.Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4. Check if  user changed password after the JWT the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  //GRAND ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => (req, res, next) => {
  //roles ['admin', 'lead-guide']
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('Yo do not have permission to perform this action', 403)
    );
  }
  next();
};
exports.fogotPassword = catchAsync(async (req, res, next) => {
  // 1.Get user based on POSTed email.
  const user = await User.findOne({ email: req.body.email }).select('+emailActiveToken');
  if (user.emailActiveToken) {
    return next(new AppError('Account not activated. Please activate', 401))
  }
  if (!user) {
    return next(new AppError('There is no user with email address ', 404))
  }



  //2.Generate the random reset token.
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3.Send it user's email

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Fogot yout password? Submit a PATCH request with your new password and passwordConfirm to:${resetURL}. \nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Yout password reset token (valid 10 min)',
      message
    })

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!'
    })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again.later!', 500))
  }


});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. Get user based token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gte: Date.now() } });
  //2.If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  //3. Update changedPasswordAt propery for the user.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();


  //4. Log the user in, send JWT token 
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });


});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. Get user from collection.
  const user = await User.findById(req.user.id).select('+password');

  //2. Check if POSTed current password is correct.
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)
  )) return next(new AppError('You carrent password is wrong', 401));


  //3. If so, update password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4. Log user in, send JWT.
  createSendToken(user, 200, res);
});

exports.activateUserEmail = catchAsync(async (req, res, next) => {
  //1. Get user based token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const updateUser = await User.findOneAndUpdate({ emailActiveToken: hashedToken }, { emailActiveToken: undefined, active: true }, { new: true, runValidators: false });

  if (!updateUser) return next(new AppError('The user is already activated. Please log in!', 403));




  res.status(200).json({
    status: 'success',
    message: 'Active!!!',
  });
});


