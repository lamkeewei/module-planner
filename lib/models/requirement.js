'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RequirementSchema = new Schema({
  firstMajor: { type: String, required: true },
  secondMajor: { type: String, required: true },
  preassigned: [ { type: Schema.Types.ObjectId, ref: 'Course' } ],
  requirements: [{
    type: { type: String, required: true },
    qtyRequired: { type: Number, required: true },
    subtypes: [{
      type: { type: String, required: true },
      qtyRequired: { type: Number, required: true }
    }]
  }]
});

// Validate for unique firstMajor and secondMajor composite primary key
RequirementSchema
  .pre('save', function(next){
    var query = {
      firstMajor: this.firstMajor,
      secondMajor: this.secondMajor
    };

    this.constructor.findOne(query, function(err, requirement){
      if (err) return next(err);

      if (requirement) {
        return next(new Error('Non-unique first and second major combination'));
      } else {
        next();
      }
    });
  });

module.exports = mongoose.model('Requirement', RequirementSchema);