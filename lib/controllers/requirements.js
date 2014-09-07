'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Requirement = mongoose.model('Requirement');

exports.findByType = function(req, res, next){
  var type = req.params.type;
  Requirement.find({ type: type }, function(err, requirements){
    if (err) return res.json(500, err);
    if (requirements.length < 1) return res.json(404, { message: 'No match found! '});

    res.json(200, requirements);
  });  
};

exports.findByMajor = function(req, res, next){
  var major = req.params.major;
  Requirement
    .findOne({ major: major })
    .populate('preassigned.courseId')
    .exec(function(err, requirements){
      if (err) return res.json(500, err);
      if (requirements.length < 1) return res.json(404, { message: 'No match found! '});
      res.json(200, requirements);
    });  
};

exports.getAllRequirements = function(req, res, next){
    Requirement
      .find({})
      .populate('preassigned.courseId')
      .exec(function(err, requirements){
        if (err) return res.json(500, err);
        res.json(200, requirements);
      });
};

exports.add = function(req, res, next){
  if (req.body._id) {
    delete req.body._id;
  }
  var requirement = new Requirement(req.body);  
  requirement.save(function(err){
    if (err) return res.json(500, err);
    res.send(200);
  });
};

exports.update =function(req, res, next){
  var data = req.body;
  Requirement.findById(data._id, function(err, requirement){
    if (err) { return res.json(500, err); }
    if(!requirement) { return res.send(404); }

    requirement.major = data.major;
    requirement.type = data.type;
    requirement.preassigned = data.preassigned;
    requirement.requirements = data.requirements;

    requirement.save(function(err){
      if (err) { return res.json(500, err); }
      res.send(200);
    });
  });
};