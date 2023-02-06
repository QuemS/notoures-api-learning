const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

//Atlas inet
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

//local
const DB = process.env.DATA_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connections successful!'));

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

module.exports = app;
