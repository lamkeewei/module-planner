'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RequirementSchema = new Schema({
  major: { type: String, required: true, unique: true },
  preassigned: [ {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    category: String
  } ],
  requirements: [{
    type: { type: String, required: true },
    qtyRequired: { type: Number, required: true },
    subtypes: [{
      type: { type: String, required: true },
      qtyRequired: { type: Number, required: true }
    }]
  }]
});

module.exports = mongoose.model('Requirement', RequirementSchema);