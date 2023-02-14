//review / rating /createAt/ ref to tour / ref to user/
const mongose = require('mongoose');
const populateFn = require('../utils/populateFunction')

const reviewSchema = new mongose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    min: [1, 'Min rating 1'],
    max: [5, 'Max rating 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  ],
  user: [
    {
      type: mongose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  ]
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

reviewSchema.pre(/^find/, populateFn('user', '-name -photo'));





const Review = mongose.model('Review', reviewSchema);

module.exports = Review;