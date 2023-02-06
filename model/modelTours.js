const mongoose = require('mongoose');
const slugify = require('slugify');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    slag: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    tourSecret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDWARE: runs before .save() and create();
toursSchema.pre('save', function (next) {
  this.slag = slugify(this.name, { lower: true });
  console.log(this);
  next();
});
// toursSchema.pre('save', function (next) {
//   //this save doc
//   console.log(this);
//   next();
// });

// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   console.log(this);
//   next();
// });

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  this.find({ tourSecret: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', toursSchema);
module.exports = Tour;
