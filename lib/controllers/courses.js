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

// Add courses
exports.addCourse = function(req, res, next){
  var course = new Course(req.body);
  course.save(function(err){
    if (err) return res.json(500, err);
    res.send(200);
  });
};

//Get all
exports.getAll = function(req, res, next){
  Course.find({}, function(err, courses){
    if (err) return res.json(500, err);
    res.json(200, courses);
  });
};