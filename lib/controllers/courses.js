'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Course = mongoose.model('Course');

// Find matching course by category
exports.findByCategory = function(req, res, next){
  var category = req.params.category;
  var query = {
    category: category
  };

  Course.find(query, function(err, courses){
    if (err) return res.json(500, err);    

    res.json(200, courses);
  });
};