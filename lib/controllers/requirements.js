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
    