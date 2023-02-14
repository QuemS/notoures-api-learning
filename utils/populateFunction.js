module.exports = (path, select) => function (next) {
  // path = 'user tour' //selcet '-__v -passwordChangedAt'
  this.populate({
    path,
    select,

  });
  next();
}