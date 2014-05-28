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
  requirement: { type: Schema.Types.ObjectId, ref: 'Requirement' },
  exemptions: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  selected: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
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
    this.populate('requirement exemptions selected doubleCount', function(err, doc){
      if (err) return cb(err);
      Course.populate(doc, 'requirement.preassigned', function(err, data){
        if (err) return cb(err);
        var planner = [];
        if (!data.requirement) return cb(err);

        // Sort the requirements based on the qty required 
        var requirements = data.requirement.requirements;
        requirements = _.sortBy(requirements, 'qtyRequired');

        // Set the preassigned tag on those that are preassigned
        var preassigned = data.requirement.preassigned;
        preassigned.forEach(function(p, i){
          p.category.push('Preassigned');
        });

        // Filter away the intersect of preassigned and exemptions
        preassigned = _.uniq(_.union(data.exemptions, preassigned), 'code');
        var combined = _.union(preassigned, data.selected);

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
          flat[el.type] = el.courses;                 

          if (el.subtypes.length > 0) {
            el.subtypes.forEach(function(sub, i){
              flat[sub.type] = sub.courses;
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
        planner.forEach(function(category, i){
          var categoryDoubleCount = doubleCounts[category.type];
          if (categoryDoubleCount){
            categoryDoubleCount.forEach(function(dc, i){
              var type = category.type;
              var empty = countEmpty(flat[type]);
              if(empty > 0){
                flat[type].splice(flat[type].length - 1, 1);
                flat[dc.freeUp].push({});
              }
            });            
          }
        });

        cb(null, planner);
      });
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
