const express = require('express');

const morgan = require('morgan');

const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');

const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');

//1. MIDDLEWARE
// importData(); import data json
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//3.ROUTES

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
