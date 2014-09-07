'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourseSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  category: [ String ],
  subcategory: [ String ],
  prerequisite: [ { type: Schema.Types.ObjectId, ref: 'Course' } ],
  doubleCount: [{
    replace: String,
    freeUp: String
  }],
  hidden: { type: Boolean, default: false }
});

// Virtuals 
CourseSchema
  .virtual('canDoubleCount')
  .get(function(){
    return this.category.length > 1;
  });

module.exports = mongoose.model('Course', CourseSchema);