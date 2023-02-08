const AppError = require('../utils/appError');

const handeCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};
const handlerDublicateFielsDB = (err) => {
  const key = Object.entries(err.keyValue).flat().join(':');

  const message = `Dublicate fields value {${key}}. Please use anothe value!`;

  return new AppError(message, 400);
};

const handlerValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};
const errorSendDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorSendProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other unknown error:don't leak error defails
  } else {
    //1) Log error
    console.error('ERROR', err);

    //2) Send genemic message
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went very wrong!',
      err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorSendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handeCastErrorDB(error);

    if (err.code === 11000) error = handlerDublicateFielsDB(error);

    if (err.name === 'ValidationError') error = handlerValidationError(error);

    errorSendProd(error, res);
  }
};
