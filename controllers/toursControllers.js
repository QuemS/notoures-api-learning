/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../model/modelTours');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //BUILD QUERY
    //1A. Filtering
    const queryObj = { ...req.query };
    const exludesFields = ['page', 'limit', 'sort', 'fields'];
    exludesFields.forEach((el) => delete queryObj[el]);

    //1B. Advenced filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    //2. Sorting
    if (req.query.sort) {
      const queryBy = req.query.sort.split(',').join(' ');
      query = query.sort(queryBy);
    } else {
      query = query.sort('-createAt');
    }
    //3. Fields limit
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //4. Paginations
    //EXECUTED QUERY
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid ID!',
    });
  }
};
exports.createToor = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
exports.updateToor = async (req, res) => {
  try {
    await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: 'Done ! update file',
    });
  } catch (error) {
    console.log(error);
  }
};
exports.deleteToor = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Done ! File delete',
    });
  } catch (error) {
    console.log(error);
  }
};
