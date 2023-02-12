const express = require('express');
// const cors = require('cors')
const morgan = require('morgan');

const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');
//CROS OPTIONS
// const optionsCors = require('./utils/optionsCors')


//1. MIDDLEWARE GLOBAL

// app.use(cors(optionsCors));
//Set secutiry  HTTP headers.
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from IP, please try again in an hour!"
})

app.use('/api', limiter);

//Body parser reading data from body intro req.nody
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitizaion against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

//Serving static file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


//3.ROUTES

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
