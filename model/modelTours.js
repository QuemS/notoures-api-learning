const mongoose = require('mongoose');
const slugify = require('slugify');
// const populateFn = require('../utils/populateFunction')
// const validator = require('validator');
// const User = require('./userModel')

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'Max name 40 sibmol'],
      minlength: [10, 'Min name 10 sibmol'],
      // validate: [validator.isAlpha, 'Tour  name must only contain charachers'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either:easy, medium, difficult ',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Min rating 1'],
      max: [5, 'Max rating 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //CASTOM VALIDATE
      validate: {
        validator: function (val) {
          //this only points to current doc on New document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) be below regular price',
      },
    },

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
    startLocation: {
      type: {
        type: String,
        default: "Point",
        emun: ['Point']
      },
      coordinates: [Number],
      adress: String,
      description: String
    },
    locations: [{
      type: {
        type: String,
        default: "Point",
        emun: ['Point']
      },
      coordinates: [Number],
      adress: String,
      description: String,
      day: Number
    }

    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId, ref: 'User'
      }
    ],
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Review"
    //   }
    // ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Virtual populate
toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',

})

//DOCUMENT MIDDWARE: runs before .save() and create();
toursSchema.pre('save', function (next) {
  this.slag = slugify(this.name, { lower: true });
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
// toursSchema.pre(/^find/, populateFn('guides', '-__v -passwordChangedAt'))

// toursSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromise)
// })

//AGREGARION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { tourSecret: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', toursSchema);
module.exports = Tour;
