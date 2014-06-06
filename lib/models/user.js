'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  requirement: [{ type: Schema.Types.ObjectId, ref: 'Requirement' }],
  exemptions: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  selected: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    category: String
  }],
  doubleCount: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  scheduled: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    year: Number,
    semester: { type: Number, min: 1, max: 2 }
  }]
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'provider': this.provider
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {        
    return {
      'name': this.name,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  getPlanner: function(cb){
    this.populate('requirement exemptions selected.courseId doubleCount', function(err, doc){
      if (err) return cb(err);
      Course.populate(doc, 'requirement.preassigned.courseId', function(err, data){
        if (err) return cb(err);
        var planner = [];
        if (data.requirement.length < 1) return cb(err);

        // Sort the requirements based on the qty required
        // TODO: Have to change this to combine all the requirements
        var allRequirements = data.requirement[0];

        var requirements = allRequirements.requirements;

        // Set the preassigned tag on those that are preassigned
        var preassigned = allRequirements.preassigned;
        
        preassigned = _.reduce(preassigned, function(arr, el){
          var course = el.courseId;
          var isExemption = _.indexOf(course.category, 'Exemption') > -1;
          course.category.splice(0, course.category.length);
          course.category.push(el.category);
          if (isExemption) {
            course.category.push('Exemption');
          }
          arr.push(course);
          return arr;
        }, []);


        preassigned.forEach(function(p, i){
          p.category.push('Preassigned');
        });

        // Filter away the intersect of preassigned and exemptions
        preassigned = _.uniq(_.union(data.exemptions, preassigned), 'code');

        var selected = _.reduce(data.selected, function(arr, el){
          var course = el.courseId;
          course.category.splice(0, course.category.length);
          course.category.push(el.category);
          arr.push(course);
          return arr;
        }, []);

        var combined = _.union(preassigned, selected);

        // Convert to normal objects for adding attribute
        combined = _.map(combined, function(c){
          return c.toObject();
        });

        // Populate with schedule
        combined.forEach(function(c, i){
          var courseId = String(c._id);
          data.scheduled.forEach(function(schedule, i){
            var scheduleId = String(schedule.courseId);
            if (courseId === scheduleId) {
              c.schedule = schedule;
            }
          });
        });

        // Populate for each category
        requirements.forEach(function(r, i){
          var type = r.type;

          // Get only those that has the current category
          // What if there is more than one matching category?
          // Wouldn't it appear twice?

          var arr = _.filter(combined, function(c){
            var match = _.indexOf(c.category, type);
            return match > -1;
          });

          // Find out how many empty cells to add
          var count = r.qtyRequired - arr.length;
          for(var j = 0; j < count; j++){
            arr.push({});
          }

          var categoryModules = {
            type: type,
            courses: arr,
            qty: r.qtyRequired,
            subtypes: []
          };
          
          // Do processing for subtypes
          // TODO: Refactor to reuse the code on top
          if (r.subtypes.length > 0) {
            var subtypes = r.subtypes;
            subtypes.forEach(function(subtype, i){
              var type = subtype.type;          
              var subtypeArr = _.filter(combined, function(c){
                var match = _.indexOf(c.category, type);
                return match > -1;
              });

              var count = subtype.qtyRequired - subtypeArr.length;
              for(var j = 0; j < count; j++){
                subtypeArr.push({});
              }

              categoryModules.subtypes.push({
                type: type,
                qty: subtype.qtyRequired,
                courses: subtypeArr
              });
            });
          }
          // Add to the planner
          planner.push(categoryModules);
        });
        
        // Double count part

        var countEmpty = function(arr){
          var empty = _.filter(arr, function(el){
            return !el._id;
          });
          return empty.length;
        };

        // Flatten the planner
        var flat = _.reduce(planner, function(flat, el){
          flat[el.type] = {
            courses: el.courses,
            qtyRequired: el.qty
          };                 

          if (el.subtypes.length > 0) {
            el.subtypes.forEach(function(sub, i){
              flat[sub.type] = {
                courses: sub.courses,
                qtyRequired: sub.qty
              };
            });
          }
          return flat;
        }, {});

        var doubleCounts = _.reduce(data.doubleCount, function(arr, el){
          // Hardcoded 0 index position
          // TODO: Change to dynamic selection fo which area to double count for
          arr.push(el.doubleCount[0]);
          return arr;
        }, []);

        doubleCounts = _.groupBy(doubleCounts, 'replace');

        Object.keys(flat).forEach(function(type, i){
          var category = flat[type];
          var categoryDoubleCount = doubleCounts[type];

          // Check for modules that replace this category 
          if (categoryDoubleCount){
            categoryDoubleCount.forEach(function(dc, i){
              // If there is an empty slot in the replaced category, 
              // this means that it is free for double counting
              var empty = countEmpty(flat[dc.replace].courses);

              if(empty > 0){
                // Increment number of slots
                flat[type].courses.splice(flat[type].courses.length - 1, 1);
                var currentCount = flat[dc.freeUp].courses.length;
                // Track the required number for each category
                flat[dc.freeUp].qtyRequired += 1;
                
                if(flat[dc.freeUp].qtyRequired !== currentCount) {
                  flat[dc.freeUp].courses.push({});
                }
              }
            });            
          }
        });

        planner = planner.sort(function(a, b){
          return a.courses.length - b.courses.length;
        });

        cb(null, planner);
      });
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
