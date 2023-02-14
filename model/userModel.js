const mongoose = require('mongoose');
const validators = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


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
    validate: [validators.isEmail, 'Please provide a valid email'],
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
    required: [true, 'Please confirm your password'],
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
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailActiveToken: {
    type: String,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
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
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  console.log('yes');
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
})




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
userSchema.methods.createTokenUseraActivate = function () {
  const activeToken = crypto.randomBytes(32).toString('hex');

  this.emailActiveToken = crypto.createHash('sha256').update(activeToken).digest('hex');
  console.log(this.emailActiveToken, activeToken);
  return activeToken


};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;



  return resetToken


};





const User = mongoose.model('User', userSchema);

module.exports = User;
