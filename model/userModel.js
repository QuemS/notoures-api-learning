const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: [true, 'Please tell us your name'],
    // maxlength: [40, 'Max name 40 sibmol'],
    // minlength: [3, 'Min name 10 sibmol'],
    // validate: [validator.isAlpha, 'User name must only contain charachers'],
  },
  email: {
    type: String,
    requred: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    requred: [true, 'Please provide your password'],
    minlength: [6, 'Password must have at least 6 characters'],
    select: false,
    // maxlength: [100, 'The password must have a maximum of 100 characters'],
  },
  passwordConfirm: {
    type: String,
    requred: [true, 'Please confirm your password'],
    validate: {
      //this olny work Create() and save()
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: '2019-04-30',
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost 12

  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPasswod
) {
  return await bcrypt.compare(candidatePassword, userPasswod);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const chengedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < chengedTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
