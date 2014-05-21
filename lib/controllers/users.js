'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Course = mongoose.model('Course'),
    Requirement = mongoose.model('Requirement'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

// Register user
exports.register = function(req, res, next){
  var userId = req.user._id; 
  var data = req.body;
  var query = {
    firstMajor: data.firstMajor,
    secondMajor: data.secondMajor
  };

  Requirement.findOne(query, function(err, requirement){
    if (err) return res.json(500, err);

    if (!requirement) return res.json(404, { message: 'No match found' });

    var requirementId = requirement._id;
    var update = {
      requirement: requirementId,
      exemptions: data.exemptions
    };
    User.findByIdAndUpdate(userId, update, function(err, user){
      if (err) return res.json(500, err);
      res.send(200);
    });
  });
};

// Return populated
exports.planner = function(req, res, next){
  if (!req.user) return res.json(403, { message: 'Not signed in!'});
  var userId = req.user._id;
  User.findById(userId, function(err, user){    
    if (err) return res.json(404, err);
    if (!user) return res.json(404, new Error('No match found'));
    user.getPlanner(function(err, planner){
      if (err) return res.json(500, err);

      res.json(200, planner);
    });
  });
};

// Add to selected courses
exports.select = function(req, res, next){
  var userId = req.user._id;
  User.findById(userId, function(err, user){
    if (err) return res.send(500, err);
    if (!user) return res.send(404, { message: 'No match found' });

    var course = req.body;
    user.selected.push(course._id);
    user.save(function(err){
      if (err) return res.json(500, err);
      res.send(200);
    });
  });
};

// Get courses
exports.getCourses = function(req, res, next){
  var userId = req.user._id;
  User.findById(userId, function(err, user){
    if (err) return res.send(500, err);
    if (!user) return res.send(404, { message: 'No match found' });

    var category = req.params.category;
    var query = {
      category: category
    };

    Course.find(query, function(err, courses){
      if (err) return res.json(500, err);    
      courses = _.filter(courses, function(c){
        var match = true;
        user.selected.forEach(function(compare, i){
          if (String(compare) === String(c._id)) match = false;            
        });
        return match;
      });

      res.json(200, courses);
    });
  });
};