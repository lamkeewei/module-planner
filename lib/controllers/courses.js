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
    res.json(200, course);
  });
};

//Get all
exports.getAll = function(req, res, next){
  Course.find({}, function(err, courses){
    if (err) return res.json(500, err);
    res.json(200, courses);
  });
};

// Delete course
exports.delete = function(req, res, next){
  var id = req.params.id;  
  Course.findByIdAndRemove(id, function(err){
    if (err) return res.json(500, err);
    res.send(200);
  });
};

exports.update = function(req, res, next){
  if(req.body._id) { delete req.body._id; }

  Course.findById(req.params.id, function (err, course) {
    if (err) { return res.json(500, err); }
    if(!course) { return res.send(404); }

    course.code = req.body.code;
    course.title = req.body.title;
    course.hidden = req.body.hidden;
    course.category = req.body.category;
    course.doubleCount = req.body.doubleCount;
    course.subcategory = req.body.subcategory;

    course.save(function (err) {
      console.log(err);

      if (err) { return res.json(500, err); }
      return res.json(200, course);
    });
  });
};